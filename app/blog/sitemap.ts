import type { MetadataRoute } from "next";
import { generateAllKeywords } from "@/lib/blog/programmaticEngine";

const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://velmenora.com";

const SITEMAP_SIZE = 1000;

/* ================= INDEX ================= */
export async function generateSitemaps() {
    const all = generateAllKeywords();
    const total = Math.ceil(all.length / SITEMAP_SIZE);

    return Array.from({ length: total }, (_, id) => ({ id }));
}

/* ================= SITEMAP ================= */
export default async function sitemap({
    id,
}: {
    id: number;
}): Promise<MetadataRoute.Sitemap> {
    const all = generateAllKeywords();

    const start = id * SITEMAP_SIZE;
    const end = start + SITEMAP_SIZE;

    const slice = all.slice(start, end);

    return slice.map((item) => {
        let priority = 0.7;

        if (item.type === "best") priority = 0.9;
        else if (item.type === "low-spread") priority = 0.85;
        else if (item.type === "high-leverage") priority = 0.85;
        else if (item.type === "guide") priority = 0.8;
        else if (item.type === "beginner") priority = 0.8;

        return {
            url: `${BASE_URL}/blog/${item.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority,
        };
    });
}