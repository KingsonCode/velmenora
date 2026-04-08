// app/blog/category/[type]/page.tsx

import { getAllPostsData } from "@/lib/blog/posts";
import CategoryClient from "./CategoryClient";

/* ================= STATIC GENERATION ================= */
export async function generateStaticParams() {
    const TYPES = [
        "beginners",
        "low-spread",
        "high-leverage",
        "scalping",
        "regulation",
    ];

    return TYPES.map((type) => ({ type }));
}

/* ================= ISR (AUTO REFRESH) ================= */
export const revalidate = 3600; // 🔥 refresh every 1 hour

/* ================= CATEGORY MAP ================= */
const CATEGORY_MAP: Record<string, string> = {
    beginners: "Beginner Guides",
    "low-spread": "Low Spread Brokers",
    "high-leverage": "High Leverage Brokers",
    scalping: "Scalping Brokers",
    regulation: "Regulated Brokers",
};

/* ================= FILTER ================= */
function filterPosts(type: string, posts: any[]) {
    return posts.filter((post) => {
        const slug = post.slug.toLowerCase();

        switch (type) {
            case "beginners":
                return slug.includes("beginner");

            case "low-spread":
                return slug.includes("spread");

            case "high-leverage":
                return slug.includes("leverage");

            case "scalping":
                return slug.includes("scalping");

            case "regulation":
                return slug.includes("regulated");

            default:
                return true;
        }
    });
}

/* ================= METADATA (SEO BOOST) ================= */
export function generateMetadata({
    params,
}: {
    params: { type: string };
}) {
    const type = params.type;

    const title =
        CATEGORY_MAP[type] || "Forex Trading Guides";

    return {
        title: `${title} | Velmenora`,
        description: `Explore ${title.toLowerCase()} and find the best forex brokers for your trading strategy.`,
    };
}

/* ================= PAGE ================= */
export default function Page({
    params,
}: {
    params: { type: string };
}) {
    const type = params?.type || "all";

    const allPosts = getAllPostsData(); // ✅ server-safe
    const posts = filterPosts(type, allPosts);

    const title =
        CATEGORY_MAP[type] || "Forex Trading Guides";

    return (
        <CategoryClient
            posts={posts}
            type={type}
            title={title}
        />
    );
}