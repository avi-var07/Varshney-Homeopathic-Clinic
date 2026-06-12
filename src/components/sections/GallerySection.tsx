"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FiX, FiChevronLeft, FiChevronRight, FiMapPin, FiCalendar } from "react-icons/fi";
import { FaHandHoldingMedical } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/*  Gallery items                                                      */
/* ------------------------------------------------------------------ */

const galleryItems = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270575/vhc-site/outside.jpg",
    emoji: "🏥",
    label: "Clinic Exterior",
    category: "Clinic",
    bg: "from-green-100 to-green-200",
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270569/vhc-site/inside.jpg",
    emoji: "💊",
    label: "Inside Clinic",
    category: "Clinic",
    bg: "from-blue-100 to-blue-200",
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270551/vhc-site/Dr-Aman.jpg",
    emoji: "👨‍⚕️",
    label: "Dr. Aman Varshney",
    category: "Consultation",
    bg: "from-saffron-100 to-saffron-200",
  },
  {
    id: 5,
    image: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270576/vhc-site/prescription.jpg",
    emoji: "📋",
    label: "Patient Consultation",
    category: "Consultation",
    bg: "from-rose-100 to-rose-200",
  },
  {
    id: 6,
    image: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270549/vhc-site/about.jpg",
    emoji: "🏕️",
    label: "About the Clinic",
    category: "Clinic",
    bg: "from-amber-100 to-amber-200",
  },
  {
    id: 7,
    image: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270572/vhc-site/medicines/1.jpg",
    emoji: "💉",
    label: "Medicines Collection 1",
    category: "Pharmacy",
    bg: "from-purple-100 to-purple-200",
  },
  {
    id: 8,
    image: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270573/vhc-site/medicines/2.jpg",
    emoji: "💉",
    label: "Medicines Collection 2",
    category: "Pharmacy",
    bg: "from-purple-100 to-purple-200",
  },
];

/* ------------------------------------------------------------------ */
/*  Health campaigns — add new campaigns here in the future            */
/* ------------------------------------------------------------------ */

interface Campaign {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  coverImage: string;
  photos: { src: string; caption: string }[];
  badge: string;
}

const campaigns: Campaign[] = [
  {
    id: "hinauli-may-2024",
    title: "Free Medical Checkup Camp",
    description:
      "A free homeopathic medical checkup camp organized by Varshney Homeopathic Clinic in collaboration with Chetna Society. Villagers received free consultations, health screenings, and homeopathic medicines from Dr. Ravi Prakash Varshney and Dr. Aman Varshney.",
    location: "Hinauli, Mughalsarai",
    date: "May 2024",
    badge: "Free Camp",
    coverImage:
      "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270554/vhc-site/health-campaign/Hinauli/WhatsApp-Image-2026-06-05-at-9-25-13-PM.jpg",
    photos: [
      {
        src: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270554/vhc-site/health-campaign/Hinauli/WhatsApp-Image-2026-06-05-at-9-25-13-PM.jpg",
        caption: "Dr. Ravi Prakash Varshney & Dr. Aman Varshney providing free consultations",
      },
      {
        src: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270558/vhc-site/health-campaign/Hinauli/WhatsApp-Image-2026-06-05-at-9-25-14-PM.jpg",
        caption: "Villagers receiving free health checkups",
      },
      {
        src: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270555/vhc-site/health-campaign/Hinauli/WhatsApp-Image-2026-06-05-at-9-25-14-PM-1-.jpg",
        caption: "Free medical consultation in progress",
      },
      {
        src: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270557/vhc-site/health-campaign/Hinauli/WhatsApp-Image-2026-06-05-at-9-25-14-PM-2-.jpg",
        caption: "Community members at the health camp",
      },
      {
        src: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270559/vhc-site/health-campaign/Hinauli/WhatsApp-Image-2026-06-05-at-9-25-15-PM.jpg",
        caption: "Health awareness and checkup session",
      },
      {
        src: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270561/vhc-site/health-campaign/Hinauli/WhatsApp-Image-2026-06-05-at-9-25-16-PM.jpg",
        caption: "Free homeopathic medicines being distributed",
      },
      {
        src: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270563/vhc-site/health-campaign/Hinauli/WhatsApp-Image-2026-06-05-at-9-25-17-PM.jpg",
        caption: "Patients waiting for their turn at the camp",
      },
      {
        src: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270562/vhc-site/health-campaign/Hinauli/WhatsApp-Image-2026-06-05-at-9-25-17-PM-1-.jpg",
        caption: "One-on-one patient consultation during the camp",
      },
      {
        src: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270567/vhc-site/health-campaign/Hinauli/WhatsApp-Image-2026-06-05-at-9-25-18-PM.jpg",
        caption: "Community health screening in progress",
      },
      {
        src: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270565/vhc-site/health-campaign/Hinauli/WhatsApp-Image-2026-06-05-at-9-25-18-PM-1-.jpg",
        caption: "Villagers receiving health advice and guidance",
      },
      {
        src: "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270566/vhc-site/health-campaign/Hinauli/WhatsApp-Image-2026-06-05-at-9-25-18-PM-2-.jpg",
        caption: "The health camp setup at Hinauli village",
      },
    ],
  },
  // Future campaigns go here:
  // {
  //   id: "some-village-date",
  //   title: "...",
  //   ...
  // },
];

const categories = ["All", "Clinic", "Consultation", "Pharmacy", "Community"];

/* ------------------------------------------------------------------ */
/*  Campaign Photo Modal                                               */
/* ------------------------------------------------------------------ */

function CampaignModal({
  campaign,
  onClose,
}: {
  campaign: Campaign;
  onClose: () => void;
}) {
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const goNext = useCallback(() => {
    setCurrentPhoto((p) => (p + 1) % campaign.photos.length);
  }, [campaign.photos.length]);

  const goPrev = useCallback(() => {
    setCurrentPhoto(
      (p) => (p - 1 + campaign.photos.length) % campaign.photos.length
    );
  }, [campaign.photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goNext, goPrev]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`${campaign.title} photo gallery`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-t-2xl px-5 py-4 border border-white/10">
          <div>
            <h3 className="text-white font-bold text-lg sm:text-xl">
              {campaign.title}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-green-300 text-xs sm:text-sm">
                <FiMapPin className="w-3.5 h-3.5" />
                {campaign.location}
              </span>
              <span className="flex items-center gap-1 text-green-300 text-xs sm:text-sm">
                <FiCalendar className="w-3.5 h-3.5" />
                {campaign.date}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close gallery"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Main Photo */}
        <div className="relative bg-black flex-1 min-h-[300px] sm:min-h-[400px] md:min-h-[480px]">
          <Image
            src={campaign.photos[currentPhoto].src}
            alt={campaign.photos[currentPhoto].caption}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
          />

          {/* Nav arrows */}
          {campaign.photos.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                aria-label="Previous photo"
              >
                <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                aria-label="Next photo"
              >
                <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-medium">
            {currentPhoto + 1} / {campaign.photos.length}
          </div>
        </div>

        {/* Caption + Thumbnails */}
        <div className="bg-white/10 backdrop-blur-md rounded-b-2xl border border-white/10 border-t-0">
          {/* Caption */}
          <p className="text-white/90 text-sm text-center px-5 py-3 border-b border-white/10">
            {campaign.photos[currentPhoto].caption}
          </p>

          {/* Thumbnail strip */}
          <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
            {campaign.photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setCurrentPhoto(i)}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  i === currentPhoto
                    ? "border-green-400 ring-1 ring-green-400/50 scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                aria-label={`View photo ${i + 1}`}
              >
                <Image
                  src={photo.src}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Single Image Modal                                                 */
/* ------------------------------------------------------------------ */

function ImageModal({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        aria-label="Close"
      >
        <FiX className="w-5 h-5" />
      </button>
      <div
        className="relative z-10 w-full max-w-5xl h-[80vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center">
          <p className="text-white text-lg font-medium">{alt}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main GallerySection                                                */
/* ------------------------------------------------------------------ */

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [activeImage, setActiveImage] = useState<{src: string, alt: string} | null>(null);

  const filtered =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  // Show campaign cards when "All" or "Community" is selected
  const showCampaigns =
    activeCategory === "All" || activeCategory === "Community";

  return (
    <>
      <section id="gallery" className="section-pad bg-cream-50">
        <div className="container-pad">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="badge-saffron mb-3">Gallery</span>
            <h2 className="section-title mb-4">
              Our Clinic &amp; <span className="text-gradient">Community</span>
            </h2>
            <p className="section-subtitle mx-auto text-center">
              A warm, welcoming environment where healing begins. See our
              clinic, team, and community activities.
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
                onClick={() => item.image && setActiveImage({ src: item.image, alt: item.label })}
                className={`group bg-gradient-to-br ${item.bg} rounded-3xl aspect-square flex flex-col items-center justify-center border border-white/50 overflow-hidden hover:shadow-soft transition-all duration-300 hover:-translate-y-1 ${item.image ? "cursor-pointer" : ""} relative`}
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

          {/* Community Service Section — below gallery grid */}
          {showCampaigns && campaigns.length > 0 && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <span className="badge-green mb-3">
                  <FaHandHoldingMedical className="w-4 h-4 inline-block mr-1.5" />
                  Community Service
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-green-900 mt-3 mb-2">
                  Health Campaigns &amp;{" "}
                  <span className="text-gradient">Free Medical Camps</span>
                </h3>
                <p className="section-subtitle mx-auto text-center text-sm sm:text-base">
                  Varshney Homeopathic Clinic regularly organizes free health
                  camps in rural and underserved communities, providing
                  accessible healthcare to those who need it most.
                </p>
              </div>

              {/* Campaign cards — expandable list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    onClick={() => setActiveCampaign(campaign)}
                    className="group bg-white rounded-3xl shadow-card border border-green-100 overflow-hidden hover:shadow-soft transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Cover */}
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={campaign.coverImage}
                        alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg">
                          <FaHandHoldingMedical className="w-3.5 h-3.5" />
                          {campaign.badge}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                          📸 {campaign.photos.length} photos
                        </span>
                      </div>

                      {/* Location / Date on cover */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-white text-sm font-medium">
                          <FiMapPin className="w-4 h-4 text-green-300" />
                          {campaign.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-green-200 text-sm">
                          <FiCalendar className="w-4 h-4" />
                          {campaign.date}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6">
                      <h4 className="text-green-900 font-bold text-lg mb-2">
                        {campaign.title}
                      </h4>
                      <p className="text-green-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {campaign.description}
                      </p>

                      {/* Photo preview strip */}
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {campaign.photos.slice(0, 4).map((photo, i) => (
                            <div
                              key={i}
                              className="w-9 h-9 rounded-lg overflow-hidden border-2 border-white shadow-sm"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={photo.src}
                                alt={`Preview ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {campaign.photos.length > 4 && (
                            <div className="w-9 h-9 rounded-lg bg-green-100 border-2 border-white shadow-sm flex items-center justify-center">
                              <span className="text-green-700 text-[10px] font-bold">
                                +{campaign.photos.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-green-500 text-xs font-medium ml-auto group-hover:text-green-700 transition-colors">
                          View all photos →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

      {/* Campaign Photo Modal */}
      {activeCampaign && (
        <CampaignModal
          campaign={activeCampaign}
          onClose={() => setActiveCampaign(null)}
        />
      )}

      {/* Single Image Modal */}
      {activeImage && (
        <ImageModal
          src={activeImage.src}
          alt={activeImage.alt}
          onClose={() => setActiveImage(null)}
        />
      )}
    </>
  );
}
