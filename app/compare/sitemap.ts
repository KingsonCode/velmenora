import type { MetadataRoute } from "next";
import { getCompareSlugs } from "@/lib/compare";

const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://velmenora.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return getCompareSlugs().map((slug) => ({
        url: `${BASE_URL}/compare/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.88,
    }));
}