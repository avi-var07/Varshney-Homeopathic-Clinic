import type { MetadataRoute } from "next";
import { TREATMENT_CATEGORIES, SAMPLE_BLOGS } from "@/lib/constants";
import { BASE_URL } from "@/lib/siteConfig";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

/**
 * Next.js App Router sitemap generator.
 *
 * Produces /sitemap.xml automatically.
 *
 * Route discovery strategy:
 *  - Static pages:  manually listed (auto-detection of the file-system is
 *                   unreliable at runtime because compiled output differs)
 *  - Dynamic pages: treatments are enumerated from TREATMENT_CATEGORIES;
 *                   blogs come from SAMPLE_BLOGS *plus* any published
 *                   Blog documents in MongoDB (de-duplicated by slug).
 *
 * Excluded:
 *  - API routes          (/api/*)
 *  - Admin panel         (/admin/*)
 *  - Doctor dashboard    (/doctor/*)
 *  - Patient dashboard   (/dashboard/*)
 *  - Route groups / private folders
 *  - Special files (layout, loading, error, etc.)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static pages ──────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/treatments`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/book`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/reviews/submit`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // ── Treatment pages (from constants — always available) ───────────────
  const treatmentRoutes: MetadataRoute.Sitemap = TREATMENT_CATEGORIES.map(
    (t) => ({
      url: `${BASE_URL}/treatments/${t.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  // ── Blog pages ────────────────────────────────────────────────────────
  // Start with the static sample blogs
  const blogSlugsSet = new Set<string>();
  const blogRoutes: MetadataRoute.Sitemap = [];

  for (const b of SAMPLE_BLOGS) {
    blogSlugsSet.add(b.slug);
    blogRoutes.push({
      url: `${BASE_URL}/blog/${b.slug}`,
      lastModified: new Date(b.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    });
  }

  // Attempt to fetch published blogs from MongoDB (if the DB is reachable).
  // This is wrapped in try/catch so the sitemap still works if the DB is
  // unavailable (e.g. during a static build without network access).
  try {
    await dbConnect();

    const dbBlogs = await Blog.find(
      { published: true },
      { slug: 1, updatedAt: 1, createdAt: 1 }
    ).lean();

    for (const blog of dbBlogs) {
      if (!blogSlugsSet.has(blog.slug)) {
        blogSlugsSet.add(blog.slug);
        blogRoutes.push({
          url: `${BASE_URL}/blog/${blog.slug}`,
          lastModified: blog.updatedAt ?? blog.createdAt ?? now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        });
      }
    }
  } catch {
    // DB unavailable — continue with static blogs only
    console.warn(
      "[sitemap] Could not connect to MongoDB — only static blogs included."
    );
  }

  return [...staticRoutes, ...treatmentRoutes, ...blogRoutes];
}
