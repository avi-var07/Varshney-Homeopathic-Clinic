import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { SAMPLE_BLOGS, DOCTOR_NAME, WHATSAPP_LINK } from "@/lib/constants";
import { FiClock, FiTag, FiShare2, FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

// Minimal blog content
const blogContent: Record<string, string> = {
  "homeopathic-treatment-migraine": `
Migraine is a debilitating neurological condition affecting millions across India. Unlike ordinary headaches, migraines involve throbbing pain, nausea, and extreme sensitivity to light and sound. If you're searching for a gentle, long-lasting solution, homeopathy may be the answer.

## Understanding Migraine

Migraines are not just "bad headaches." They are complex neurological events that can last from 4 to 72 hours and significantly impact quality of life. Common triggers include:

- **Hormonal changes** — especially in women before periods
- **Stress and anxiety**
- **Poor sleep patterns**
- **Dietary triggers** — cheese, caffeine, alcohol, MSG
- **Bright lights and loud sounds**
- **Weather changes**

## How Homeopathy Treats Migraine Differently

While conventional medicine focuses on symptom suppression through pain relievers or preventive drugs, **homeopathy treats the root cause**. 

Constitutional homeopathic treatment addresses:
1. Your nervous system's sensitivity
2. Stress response patterns
3. Hormonal influences
4. Digestive connections

*Note: Only a qualified homeopath can prescribe the correct remedy for you.*

## Lifestyle Tips to Prevent Migraine

1. Maintain a regular sleep schedule
2. Stay hydrated — dehydration is a major trigger
3. Identify your personal food triggers and avoid them
4. Practice yoga and pranayama daily
5. Use blue-light filtering glasses for screens

## Patient Success Story

*"I had been suffering from migraines for 5 years. After 3 months of homeopathic treatment with Dr. Aman Varshney, my attacks reduced from 8 per month to just 1. I am now almost completely free of migraines."* — Sunita Devi, Mughalsarai

## When to See Dr. Aman Varshney

If you experience:
- Migraines more than 4 times a month
- Migraines lasting more than 24 hours
- Migraines not responding to conventional medication
- Side effects from migraine medications

...it's time to try constitutional homeopathy.

Book your appointment today at Varshney Homeopathic Clinic, Mughalsarai, Chandauli.
  `,
  "hair-fall-causes-homeopathy": `
Hair fall is one of the most distressing health concerns in India today. Studies show that over 60% of Indians experience significant hair loss by age 35. If you're noticing excessive hair in your brush, on your pillow, or in the shower — you're not alone.

## Why Is Hair Fall So Common?

Modern lifestyle, stress, pollution, and nutritional deficiencies have made hair loss incredibly common. But the good news is — **most causes of hair fall are treatable**.

## The Root Causes of Hair Fall

### 1. Nutritional Deficiencies
- Iron deficiency (most common in women)
- Protein deficiency
- Zinc and Vitamin D deficiency
- B-vitamin deficiency (especially biotin)

### 2. Hormonal Imbalances
- Thyroid disorders (both hypo and hyperthyroidism)
- PCOD/PCOS in women
- Androgenic alopecia in men

### 3. Stress
- Chronic stress causes a condition called **telogen effluvium** — massive hair shedding that starts 2-3 months after a stressful event.

### 4. Scalp Conditions
- Dandruff and seborrheic dermatitis
- Fungal infections
- Alopecia areata (autoimmune)

## How Homeopathy Treats Hair Fall

Homeopathy treats hair fall **from the inside out**. Rather than just stimulating the scalp externally, it addresses the underlying health imbalance causing hair loss.

## Hair Care Tips During Treatment

1. Oil massage with warm coconut or brahmi oil twice weekly
2. Avoid harsh chemical shampoos — use sulfate-free products
3. Don't tie hair too tightly
4. Eat protein with every meal — eggs, lentils, paneer, nuts
5. Reduce heat styling tools

Book a consultation today with Dr. Aman Varshney at Varshney Homeopathic Clinic, Mughalsarai.
  `,
  "best-homeopathic-clinic-mughalsarai": `
If you're looking for trusted, effective homeopathic care in Mughalsarai (now known as Pt. Deen Dayal Upadhyay Nagar), Chandauli, or the nearby Varanasi region — **Varshney Homeopathic Clinic** is your answer.

## About Varshney Homeopathic Clinic

Located in the heart of Mughalsarai, Varshney Homeopathic Clinic has been serving families for over 15 years. Led by **Dr. Aman Varshney** (BHMS), the clinic provides expert homeopathic treatment for a wide range of health conditions.

### What Makes Us Different?

1. **Patient-First Approach** — Every patient is listened to carefully. We believe understanding you completely is the first step to healing.

2. **Constitutional Treatment** — We don't just treat symptoms. We treat the whole person — mind, body, and spirit.

3. **100% Natural Medicines** — Pure, high-quality homeopathic medicines from our own **Reliable Homeo Pharmacy**.

4. **Affordable Care** — Homeopathy is inherently affordable, and we ensure our fees remain accessible to all families.

5. **Family Clinic** — We treat everyone from newborns to elderly patients.

## Conditions We Treat

At Varshney Homeopathic Clinic, we successfully treat:
- Chronic diseases — Migraine, Thyroid, PCOD, Arthritis
- Skin conditions — Eczema, Psoriasis, Acne, Allergies
- Children's health — Recurrent infections, Tonsils, Growth issues
- Mental wellness — Anxiety, Stress, Insomnia
- Women's health — PCOD, Menstrual issues, Hormonal balance
- Digestive disorders — Acidity, IBS, Gastritis

## Our Location

**Varshney Homeopathic Clinic**
Mughalsarai (Pt. Deen Dayal Upadhyay Nagar)
Chandauli, Uttar Pradesh — Near Varanasi

**Phone/WhatsApp:** +91 7388333991

## Book Your Appointment

Getting an appointment is simple. You can:
1. **Call us** at +91 7388333991
2. **WhatsApp us** for instant booking
3. **Book online** through our website

Take the first step toward natural healing today.
  `,
};

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = SAMPLE_BLOGS.find((b) => b.slug === params.slug);
  if (!blog) return { title: "Blog Not Found" };
  return {
    title: blog.title,
    description: blog.excerpt,
    keywords: blog.tags,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.date,
      authors: [DOCTOR_NAME],
    },
  };
}

export async function generateStaticParams() {
  return SAMPLE_BLOGS.map((b) => ({ slug: b.slug }));
}

export default function BlogDetailPage({ params }: Props) {
  const blog = SAMPLE_BLOGS.find((b) => b.slug === params.slug);
  if (!blog) notFound();

  const content = blogContent[blog.slug] || blog.excerpt;
  const relatedBlogs = SAMPLE_BLOGS.filter(
    (b) => b.slug !== blog.slug && b.category === blog.category
  ).slice(0, 3);
  const otherBlogs = SAMPLE_BLOGS.filter((b) => b.slug !== blog.slug).slice(0, 3);
  const displayRelated = relatedBlogs.length > 0 ? relatedBlogs : otherBlogs;

  const shareMsg = encodeURIComponent(
    `Check out this health article: ${blog.title} - Read at Varshney Homeopathic Clinic`
  );

  return (
    <main className="overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-10 bg-hero-gradient">
        <div className="container-pad max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-green-600 text-sm font-medium mb-6 hover:text-green-700"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge-green">{blog.category}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-950 leading-tight mb-4">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-green-600 text-sm mb-6">
            <span className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-green-gradient flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              {DOCTOR_NAME}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock className="w-4 h-4" />
              {blog.readTime}
            </span>
            <span>
              {new Date(blog.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs"
              >
                <FiTag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad bg-white">
        <div className="container-pad">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Article */}
            <article className="lg:col-span-2">
              {/* Excerpt */}
              <div className="bg-green-50 rounded-3xl p-6 border border-green-100 mb-8">
                <p className="text-green-800 text-lg font-medium leading-relaxed italic">
                  {blog.excerpt}
                </p>
              </div>

              {/* Main content */}
              <div className="prose prose-green max-w-none">
                {content.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) {
                    return (
                      <h2 key={i} className="text-2xl font-bold text-green-900 mt-8 mb-4">
                        {line.slice(3)}
                      </h2>
                    );
                  }
                  if (line.startsWith("### ")) {
                    return (
                      <h3 key={i} className="text-xl font-bold text-green-800 mt-6 mb-3">
                        {line.slice(4)}
                      </h3>
                    );
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <div key={i} className="flex items-start gap-2 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                        <span
                          className="text-green-700 text-base"
                          dangerouslySetInnerHTML={{
                            __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                          }}
                        />
                      </div>
                    );
                  }
                  if (line.match(/^\d+\./)) {
                    return (
                      <div key={i} className="flex items-start gap-2 mb-1.5">
                        <span className="text-green-600 font-bold text-sm flex-shrink-0 mt-0.5">
                          {line.match(/^\d+/)?.[0]}.
                        </span>
                        <span
                          className="text-green-700 text-base"
                          dangerouslySetInnerHTML={{
                            __html: line.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                          }}
                        />
                      </div>
                    );
                  }
                  if (line.startsWith("*") && line.endsWith("*")) {
                    return (
                      <blockquote
                        key={i}
                        className="border-l-4 border-green-300 pl-4 my-4 italic text-green-700 bg-green-50 py-3 pr-4 rounded-r-2xl"
                      >
                        {line.slice(1, -1)}
                      </blockquote>
                    );
                  }
                  if (line.trim() === "") return <div key={i} className="h-3"></div>;
                  return (
                    <p
                      key={i}
                      className="text-green-700 text-base leading-relaxed mb-3"
                      dangerouslySetInnerHTML={{
                        __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  );
                })}
              </div>

              {/* Share */}
              <div className="mt-10 pt-8 border-t border-green-100">
                <p className="text-green-700 font-semibold mb-3 flex items-center gap-2">
                  <FiShare2 className="w-4 h-4" />
                  Share This Article
                </p>
                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/?text=${shareMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp !py-2 !px-4 !text-sm"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    Share on WhatsApp
                  </a>
                </div>
              </div>

              {/* Author */}
              <div className="mt-8 bg-green-50 rounded-3xl p-6 border border-green-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-green-gradient flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    AV
                  </div>
                  <div>
                    <p className="font-bold text-green-900">{DOCTOR_NAME}</p>
                    <p className="text-green-600 text-sm">BHMS · Homeopathic Physician</p>
                    <p className="text-green-500 text-xs mt-0.5">
                      B.H.M.S (Bhopal) · Yoga University, America · Since 1992
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* CTA */}
              <div className="bg-green-gradient rounded-3xl p-6 text-white sticky top-24">
                <h3 className="font-bold text-lg mb-2">Need Consultation?</h3>
                <p className="text-green-100 text-sm mb-4">
                  Get expert homeopathic care from Dr. Aman Varshney.
                </p>
                <div className="space-y-2">
                  <Link
                    href="/#appointment"
                    className="flex items-center justify-center gap-2 w-full bg-white text-green-700 font-semibold py-2.5 px-4 rounded-xl text-sm hover:bg-green-50 transition-colors"
                  >
                    📅 Book Appointment
                  </Link>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-semibold py-2.5 px-4 rounded-xl text-sm hover:bg-[#1fba59] transition-colors"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    WhatsApp Now
                  </a>
                </div>
              </div>

              {/* Related Posts */}
              {displayRelated.length > 0 && (
                <div className="bg-white rounded-3xl p-5 border border-green-100 shadow-card">
                  <h3 className="font-bold text-green-900 text-base mb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {displayRelated.map((related) => (
                      <Link
                        key={related.id}
                        href={`/blog/${related.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                          <Image
                            src={related.image || "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80"}
                            alt={related.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div>
                          <p className="text-green-800 text-sm font-semibold group-hover:text-green-600 transition-colors line-clamp-2">
                            {related.title}
                          </p>
                          <p className="text-green-400 text-xs mt-0.5">{related.readTime}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="bg-green-50 rounded-3xl p-5 border border-green-100">
                <p className="text-green-800 font-bold text-sm mb-2">
                  💌 Free Health Tips
                </p>
                <p className="text-green-600 text-xs mb-3">
                  Get weekly health tips from Dr. Aman on WhatsApp.
                </p>
                <a
                  href="https://wa.me/917388333991?text=Hello%20Doctor%2C%20I%20want%20to%20receive%20your%20free%20weekly%20health%20tips."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full justify-center !text-sm !py-2.5"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  Subscribe via WhatsApp
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <StickyMobileCTA />
    </main>
  );
}
