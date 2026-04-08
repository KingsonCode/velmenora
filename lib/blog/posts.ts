// lib/blog/posts.ts

import "server-only"; // 🔥 muhimu sana

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { generateProgrammaticPost } from "./programmaticEngine";
import { getMarkets } from "./markets";

/* ================= PATH ================= */
const postsDirectory = path.join(process.cwd(), "content/blog");

/* ================= TYPES ================= */
export type BlogPost = {
    slug: string;
    title: string;
    description: string;
    date?: string;
    image?: string;
    country?: string;
    content?: string;
};

/* ================= CACHE ================= */
let cachedPosts: BlogPost[] | null = null;

/* ================= SAFE FILE READ ================= */
function safeReadDir(dir: string): string[] {
    try {
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir);
    } catch (err) {
        console.error("❌ Failed to read directory:", err);
        return [];
    }
}

/* ================= MANUAL POSTS ================= */
export function getAllPosts(): BlogPost[] {
    if (cachedPosts) return cachedPosts;

    const files = safeReadDir(postsDirectory).filter((f) =>
        f.endsWith(".md")
    );

    const posts: BlogPost[] = [];

    for (const fileName of files) {
        try {
            const filePath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(filePath, "utf8");

            const { data } = matter(fileContents);

            if (!data?.title || typeof data.title !== "string") continue;

            posts.push({
                slug: fileName.replace(".md", ""),
                title: data.title,
                description: data.description || "",
                date: data.date || "",
                image: data.image || "",
                country: data.country || "global",
            });
        } catch (err) {
            console.error(`❌ Error parsing file: ${fileName}`, err);
        }
    }

    cachedPosts = posts;
    return posts;
}

/* ================= SINGLE POST ================= */
export function getPost(slug: string): BlogPost | null {
    try {
        const manual = getAllPosts().find((p) => p.slug === slug);
        if (manual) return manual;

        const generated = generateProgrammaticPost(slug);
        return generated || null;
    } catch (err) {
        console.error("❌ getPost error:", err);
        return null;
    }
}

/* ================= PROGRAMMATIC ENGINE ================= */
function generateProgrammaticPosts(): BlogPost[] {
    const markets = getMarkets();

    const TYPES = [
        "best-brokers",
        "low-spread-brokers",
        "high-leverage-brokers",
        "forex-trading-guide",
        "how-to-trade-forex",
    ];

    const posts: BlogPost[] = [];

    for (const market of markets) {
        for (const type of TYPES) {
            const slug = `${type}-in-${market.slug}`;

            try {
                const generated = generateProgrammaticPost(slug);
                if (generated) posts.push(generated);
            } catch (err) {
                console.error(`❌ Programmatic error: ${slug}`, err);
            }
        }
    }

    return posts;
}

/* ================= DEDUPE ================= */
function dedupePosts(posts: BlogPost[]): BlogPost[] {
    return Array.from(
        new Map(posts.map((p) => [p.slug, p])).values()
    );
}

/* ================= SORT ================= */
function sortPosts(posts: BlogPost[]): BlogPost[] {
    return posts.sort((a, b) =>
        (b.date || "").localeCompare(a.date || "")
    );
}

/* ================= MAIN API ================= */
export function getAllPostsData(): BlogPost[] {
    try {
        const manualPosts = getAllPosts();
        const programmaticPosts = generateProgrammaticPosts();

        const merged = [...manualPosts, ...programmaticPosts];

        const unique = dedupePosts(merged);

        return sortPosts(unique);
    } catch (err) {
        console.error("❌ getAllPostsData error:", err);
        return [];
    }
}