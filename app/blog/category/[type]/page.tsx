import type { Metadata } from "next";
import { getAllPostsData } from "@/lib/blog/posts";
import CategoryClient from "./CategoryClient";

/* ================= STATIC GENERATION ================= */
const CATEGORY_TYPES = [
    "beginners",
    "low-spread",
    "high-leverage",
    "guides",
    "best",
] as const;

export async function generateStaticParams() {
    return CATEGORY_TYPES.map((type) => ({ type }));
}

/* ================= ISR ================= */
export const revalidate = 3600;

/* ================= CATEGORY MAP ================= */
const CATEGORY_MAP: Record<string, string> = {
    beginners: "Beginner Guides",
    "low-spread": "Low Spread Brokers",
    "high-leverage": "High Leverage Brokers",
    guides: "Forex Trading Guides",
    best: "Best Forex Brokers",
};

/* ================= TYPE MAP ================= */
const TYPE_MATCH: Record<string, string[]> = {
    beginners: ["beginner"],
    "low-spread": ["low-spread"],
    "high-leverage": ["high-leverage"],
    guides: ["guide"],
    best: ["best"],
};

/* ================= FILTER ================= */
function filterPosts(
    type: string,
    posts: ReturnType<typeof getAllPostsData>
) {
    const allowedTypes = TYPE_MATCH[type];

    if (!allowedTypes) return posts;

    return posts.filter((post) => {
        const postType = String(post.type || "").toLowerCase();
        return allowedTypes.includes(postType);
    });
}

/* ================= METADATA ================= */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ type: string }>;
}): Promise<Metadata> {
    const { type } = await params;
    const title = CATEGORY_MAP[type] || "Forex Trading Guides";
    const canonical = `https://velmenora.com/blog/category/${type}`;

    return {
        title: `${title} | Velmenora`,
        description: `Explore ${title.toLowerCase()} and find the best forex brokers for your trading strategy.`,
        alternates: {
            canonical,
        },
        openGraph: {
            title: `${title} | Velmenora`,
            description: `Explore ${title.toLowerCase()} and find the best forex brokers for your trading strategy.`,
            url: canonical,
            siteName: "Velmenora",
            type: "website",
            images: ["/og-default.jpg"],
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | Velmenora`,
            description: `Explore ${title.toLowerCase()} and find the best forex brokers for your trading strategy.`,
            images: ["/og-default.jpg"],
        },
    };
}

/* ================= PAGE ================= */
export default async function Page({
    params,
}: {
    params: Promise<{ type: string }>;
}) {
    const { type } = await params;

    const resolvedType = type || "guides";
    const allPosts = getAllPostsData();
    const posts = filterPosts(resolvedType, allPosts);
    const title = CATEGORY_MAP[resolvedType] || "Forex Trading Guides";

    return (
        <CategoryClient
            posts={posts}
            type={resolvedType}
            title={title}
        />
    );
}