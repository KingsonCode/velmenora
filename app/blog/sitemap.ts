import type { MetadataRoute } from "next";
import { generateAllKeywords } from "@/lib/blog/programmaticEngine";

const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://velmenora.com";

/* 🔥 unaweza kuongeza hadi 5000 au 10000 */
const SITEMAP_SIZE = 2000;

/* ================= INDEX ================= */
export async function generateSitemaps() {
    const all = generateAllKeywords();
    const total = Math.ceil(all.length / SITEMAP_SIZE);

    return Array.from({ length: total }, (_, id) => ({
        id: String(id), // ✅ Next.js 16 safe
    }));
}

/* ================= PRIORITY ENGINE ================= */
function getPriority(type?: string) {
    switch (type) {
        case "best":
            return 0.9; // 💰 money intent
        case "low-spread":
        case "high-leverage":
            return 0.85;
        case "guide":
        case "beginner":
            return 0.8;
        default:
            return 0.7;
    }
}

/* ================= SITEMAP ================= */
export default async function sitemap({
    id,
}: {
    id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
    const resolvedId = Number(await id);
    const all = generateAllKeywords();

    const start = resolvedId * SITEMAP_SIZE;
    const end = start + SITEMAP_SIZE;

    const slice = all.slice(start, end);

    const now = new Date();

    return slice.map((item) => ({
        url: `${BASE_URL}/blog/${item.slug}`,

        lastModified: now,

        changeFrequency: "weekly" as const,

        priority: getPriority(item.type),
    }));
}