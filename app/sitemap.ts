import type { MetadataRoute } from "next";
import { generateAllSlugs } from "@/lib/generate";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://velmenora.com";

    const now = new Date();

    /* 🔥 STATIC PAGES */
    const staticPages = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: "daily" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: now,
            changeFrequency: "daily" as const,
            priority: 0.9,
        },
    ];

    /* 🔥 DYNAMIC BLOG PAGES */
    const blogPages = generateAllSlugs().map((item) => ({
        url: `${baseUrl}/blog/${item.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    return [...staticPages, ...blogPages];
}