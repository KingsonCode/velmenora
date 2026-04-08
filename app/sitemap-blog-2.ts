import { generateAllKeywords } from "@/lib/blog/keywords";

const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://velmenora.com";

export default function sitemap() {
    const now = new Date();

    return generateAllKeywords()
        .slice(500)
        .map((item) => {
            let priority = 0.7;

            if (item.type === "best") priority = 0.9;
            else if (item.type === "low-spread") priority = 0.85;
            else if (item.type === "high-leverage") priority = 0.85;
            else if (item.type === "guide") priority = 0.8;

            return {
                url: `${BASE_URL}/blog/${item.slug}`,
                lastModified: now,
                changeFrequency: "monthly",
                priority,
            };
        });
}