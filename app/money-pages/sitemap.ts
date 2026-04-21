import type { MetadataRoute } from "next";
import { PROGRAMMATIC_SUPPORTED_LANGS } from "@/lib/programmatic/staticSlugs";

const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://www.velmenora.com";

const COUNTRIES = [
    "tanzania",
    "kenya",
    "nigeria",
    "south-africa",
    "uganda",
    "ghana",
    "india",
    "pakistan",
    "bangladesh",
    "uae",
    "saudi-arabia",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return PROGRAMMATIC_SUPPORTED_LANGS.flatMap((lang) =>
        COUNTRIES.map((country) => ({
            url: `${BASE_URL}/${lang}/best-brokers-in/${country}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }))
    );
}