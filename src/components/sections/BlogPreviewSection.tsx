import Link from "next/link";
import Image from "next/image";
import { SAMPLE_BLOGS } from "@/lib/constants";
import { FiArrowRight, FiClock, FiTag } from "react-icons/fi";

export default function BlogPreviewSection() {
  const featured = SAMPLE_BLOGS.slice(0, 3);

  return (
    <section id="blog" className="section-pad bg-warm-gradient">
      <div className="container-pad">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge-green mb-3">Health Blog</span>
          <h2 className="section-title mb-4">
            Health Tips & <span className="text-gradient">Homeopathy Insights</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Expert health advice, treatment guides, and wellness tips from Dr. Aman Varshney to help you stay healthy.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {featured.map((blog, index) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className={`group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 ${
                index === 0 ? "md:row-span-1" : ""
              }`}
            >
              {/* Blog image placeholder */}
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative overflow-hidden">
                <Image
                  src={blog.image || "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80"}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-800/20 to-transparent"></div>
                <div className="absolute bottom-3 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-green-700 rounded-full text-xs font-semibold">
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
                  <span>{new Date(blog.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>

                <h3 className="font-bold text-green-900 text-base leading-snug mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-green-600 text-sm leading-relaxed mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {blog.tags.slice(0, 2).map((tag) => (
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
                  Read More
                  <FiArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/blog" className="btn-primary">
            Read All Health Articles
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
