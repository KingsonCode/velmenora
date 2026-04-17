import type { MetadataRoute } from "next";
import { getAllPostsData } from "@/lib/blog/posts";

const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://velmenora.com";

const SITEMAP_SIZE = 1000;

export async function generateSitemaps() {
    const posts = getAllPostsData();
    const total = Math.ceil(posts.length / SITEMAP_SIZE);

    return Array.from({ length: total }, (_, id) => ({ id }));
}

export default async function sitemap({
    id,
}: {
    id: number;
}): Promise<MetadataRoute.Sitemap> {
    const posts = getAllPostsData();

    const start = id * SITEMAP_SIZE;
    const end = start + SITEMAP_SIZE;
    const slice = posts.slice(start, end);

    return slice.map((post) => {
        let priority = 0.75;

        if (post.type === "best") priority = 0.9;
        else if (post.type === "low-spread") priority = 0.85;
        else if (post.type === "high-leverage") priority = 0.85;
        else if (post.type === "guide") priority = 0.8;
        else if (post.type === "beginner") priority = 0.8;

        return {
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: post.date ? new Date(post.date) : new Date(),
            changeFrequency: "weekly",
            priority,
        };
    });
}