import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { SAMPLE_BLOGS, BLOG_CATEGORIES } from "@/lib/constants";
import { FiClock, FiTag, FiArrowRight } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Homeopathy Health Blog | Health Tips & Treatment Guides",
  description:
    "Expert health articles, homeopathy guides, and wellness tips from Dr. Aman Varshney. Learn about homeopathic treatments for migraine, skin, PCOD, hair fall, and more.",
  keywords: [
    "homeopathy blog",
    "health tips India",
    "homeopathic treatment guide",
    "dr aman varshney blog",
    "homeopathy mughalsarai",
    "health blog chandauli",
  ],
};

export default function BlogPage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-14 bg-hero-gradient">
        <div className="container-pad text-center">
          <span className="badge-green mb-4">Health Blog</span>
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
            Expert Health Tips &{" "}
            <span className="text-gradient">Homeopathy Guides</span>
          </h1>
          <p className="text-lg text-green-700/70 max-w-2xl mx-auto">
            Free health education articles by Dr. Aman Varshney. Learn about natural healing, homeopathic treatments, and healthy living.
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <section className="section-pad bg-white">
        <div className="container-pad">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {BLOG_CATEGORIES.slice(0, 8).map((cat) => (
              <span
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all ${
                  cat === "All"
                    ? "bg-green-gradient text-white"
                    : "bg-green-50 text-green-700 border border-green-200 hover:border-green-400"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_BLOGS.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 border border-green-100"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative overflow-hidden">
                  <Image
                    src={blog.image || "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80"}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-800/20 to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-white/90 text-green-700 rounded-full text-xs font-semibold">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-green-500 text-xs mb-3">
                    <span className="flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      {blog.readTime}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(blog.date).toLocaleDateString("en-IN", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h2 className="font-bold text-green-900 text-base leading-snug mb-2 group-hover:text-green-700 transition-colors">
                    {blog.title}
                  </h2>

                  <p className="text-green-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs border border-green-100"
                      >
                        <FiTag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-green-600 text-sm font-semibold group-hover:gap-2 transition-all">
                    Read Article
                    <FiArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-14 text-center bg-gradient-to-br from-green-900 to-green-800 rounded-4xl p-10 text-white">
            <h2 className="text-3xl font-bold mb-3">
              Get Free Health Tips Every Week
            </h2>
            <p className="text-green-200 text-lg mb-6">
              Join 1000+ families receiving Dr. Aman Varshney's health tips directly on WhatsApp.
            </p>
            <a
              href="https://wa.me/917388333991?text=Hello%20Doctor%2C%20I%20want%20to%20receive%20free%20health%20tips."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp inline-flex"
            >
              💬 Join WhatsApp Health Community
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <StickyMobileCTA />
    </main>
  );
}
