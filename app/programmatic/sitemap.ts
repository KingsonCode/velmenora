import type { MetadataRoute } from "next";
import {
    generateProgrammaticSlugs,
    PROGRAMMATIC_SUPPORTED_LANGS,
} from "@/lib/programmatic/staticSlugs";

const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://www.velmenora.com";

// Google example kwenye docs hutumia 50,000 max kwa sitemap moja.
// Ukiwa conservative unaweza kuweka 5,000 au 10,000 kama unataka.
const CHUNK_SIZE = 5000;

export async function generateSitemaps() {
    const slugs = generateProgrammaticSlugs();
    const totalUrls = PROGRAMMATIC_SUPPORTED_LANGS.length * slugs.length;
    const totalSitemaps = Math.ceil(totalUrls / CHUNK_SIZE);

    return Array.from({ length: totalSitemaps }, (_, i) => ({
        id: String(i),
    }));
}

export default async function sitemap({
    id,
}: {
    id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
    const resolvedId = Number(await id);
    const now = new Date();

    const slugs = generateProgrammaticSlugs();

    const allUrls = PROGRAMMATIC_SUPPORTED_LANGS.flatMap((lang) =>
        slugs.map((slug) => ({
            url: `${BASE_URL}/${lang}/${slug}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }))
    );

    const start = resolvedId * CHUNK_SIZE;
    const end = start + CHUNK_SIZE;

    return allUrls.slice(start, end);
}