import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { generateProgrammaticPost } from "./programmaticEngine";
import { getMarkets } from "./markets";

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

/* ================= CACHE (IMPORTANT FOR PERF) ================= */
let cachedPosts: BlogPost[] | null = null;

/* ================= MANUAL POSTS ================= */
export function getAllPosts(): BlogPost[] {
    if (cachedPosts) return cachedPosts;

    if (!fs.existsSync(postsDirectory)) {
        cachedPosts = [];
        return [];
    }

    try {
        const files = fs
            .readdirSync(postsDirectory)
            .filter((file) => file.endsWith(".md"));

        const posts = files.map((fileName) => {
            try {
                const filePath = path.join(postsDirectory, fileName);
                const fileContents = fs.readFileSync(filePath, "utf8");

                const { data } = matter(fileContents);

                if (!data?.title || typeof data.title !== "string") return null;

                return {
                    slug: fileName.replace(".md", ""),
                    title: data.title,
                    description: data.description || "",
                    date: data.date || "",
                    image: data.image || "",
                    country: data.country || "global",
                };
            } catch (err) {
                console.error("Error parsing:", fileName);
                return null;
            }
        });

        cachedPosts = posts.filter(Boolean) as BlogPost[];
        return cachedPosts;

    } catch (err) {
        console.error("Error reading posts directory:", err);
        return [];
    }
}

/* ================= SINGLE POST ================= */
export function getPost(slug: string): BlogPost | null {
    const manual = getAllPosts().find((p) => p.slug === slug);
    if (manual) return manual;

    const generated = generateProgrammaticPost(slug);
    return generated || null;
}

/* ================= ALL POSTS ================= */
export function getAllPostsData(): BlogPost[] {
    const manualPosts = getAllPosts();
    const markets = getMarkets();

    const programmatic: BlogPost[] = [];

    /* 🔥 FOREX TOPICS (SEO ENGINE) */
    const TYPES = [
        "best-brokers",
        "low-spread-brokers",
        "high-leverage-brokers",
        "forex-trading-guide",
        "how-to-trade-forex",
    ];

    for (const market of markets) {
        for (const type of TYPES) {
            const slug = `${type}-in-${market.slug}`;

            const generated = generateProgrammaticPost(slug);
            if (!generated) continue;

            programmatic.push(generated);
        }
    }

    /* 🔥 MERGE + DEDUPE */
    const all = [...manualPosts, ...programmatic];

    const unique = Array.from(
        new Map(all.map((p) => [p.slug, p])).values()
    );

    /* 🔥 SORT (LATEST FIRST FOR SEO) */
    return unique.sort((a, b) =>
        (b.date || "").localeCompare(a.date || "")
    );
}