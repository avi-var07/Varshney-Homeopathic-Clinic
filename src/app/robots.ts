import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/siteConfig";

/**
 * Next.js App Router robots.txt generator.
 *
 * Produces /robots.txt automatically.
 *
 * Policy:
 *  - Allow crawling of all public pages
 *  - Disallow protected/internal sections:
 *      /api/           – backend API routes
 *      /admin/         – admin panel
 *      /dashboard/     – patient dashboard
 *      /doctor/        – doctor dashboard
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/doctor/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
