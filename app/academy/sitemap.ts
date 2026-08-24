import type { MetadataRoute } from "next";

const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "") ||
    "https://velmenora.com";

const ACADEMY_PATHS = [
    "/en/academy",
    "/en/academy/what-is-forex",
    "/en/academy/forex-for-beginners",
    "/en/academy/forex-demo-account",
    "/en/academy/forex-risk-management",
    "/en/academy/how-to-trade-forex",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    return ACADEMY_PATHS.map((routePath, index) => ({
        url: `${BASE_URL}${routePath}`,
        changeFrequency: index === 0 ? "weekly" : "monthly",
        priority: index === 0 ? 0.9 : 0.8,
    }));
}
