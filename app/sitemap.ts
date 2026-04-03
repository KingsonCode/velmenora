// 📁 /app/sitemap.ts

import { generateAllSlugs } from "@/lib/generate";

type SitemapEntry = {
    url: string;
    lastModified: Date;
    changeFrequency?: "daily" | "weekly" | "monthly";
    priority?: number;
};

export default function sitemap(): SitemapEntry[] {
    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "https://velmenora.com";

    const now = new Date();

    /* =========================================================
       🔥 STATIC PAGES (HIGH PRIORITY)
    ========================================================= */
    const staticPages = ["", "/blog"];

    const staticUrls: SitemapEntry[] = staticPages.map((path) => ({
        url: `${baseUrl}${path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: path === "" ? 1.0 : 0.9,
    }));

    /* =========================================================
       🔥 BLOG PAGES (PROGRAMMATIC SEO)
    ========================================================= */
    const blogUrls: SitemapEntry[] = generateAllSlugs().map((item) => ({
        url: `${baseUrl}/blog/${item.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    /* =========================================================
       🔥 MERGE ALL
    ========================================================= */
    return [...staticUrls, ...blogUrls];
}