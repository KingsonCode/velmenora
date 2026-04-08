/* =========================================================
   🔥 IMPORTS
========================================================= */
import { countries } from "./countries";

/* =========================================================
   🔥 TYPES
========================================================= */

export type KeywordMeta = {
    slug: string;
    country: string;
    type: string;
};

/* =========================================================
   🔥 TEMPLATE ENGINE (SEO INTENTS)
========================================================= */

const TEMPLATES = [
    { prefix: "best-brokers-in-", type: "best" },
    { prefix: "low-spread-brokers-in-", type: "low-spread" },
    { prefix: "high-leverage-brokers-in-", type: "high-leverage" },
    { prefix: "how-to-trade-forex-in-", type: "guide" },
    { prefix: "forex-trading-guide-in-", type: "guide" },
    { prefix: "forex-brokers-for-beginners-in-", type: "beginner" },
    { prefix: "forex-trading-apps-in-", type: "apps" },
];

/* =========================================================
   🔥 CORE GENERATOR
========================================================= */

export function generateAllKeywords(): KeywordMeta[] {
    const results: KeywordMeta[] = [];

    for (const country of countries) {
        for (const t of TEMPLATES) {
            results.push({
                slug: `${t.prefix}${country}`,
                country,
                type: t.type,
            });
        }
    }

    return results;
}

/* =========================================================
   🔥 SLUG LIST (DEDUPED)
========================================================= */

export function generateAllSlugs(): string[] {
    const keywords = generateAllKeywords();

    // remove duplicates (safety)
    const unique = new Set(keywords.map((k) => k.slug));

    return Array.from(unique);
}

/* =========================================================
   🔥 LOOKUP HELPERS (IMPORTANT)
========================================================= */

export function getKeywordMeta(slug: string): KeywordMeta | null {
    const all = generateAllKeywords();

    return all.find((k) => k.slug === slug) || null;
}

/* =========================================================
   🔥 FILTERING (SCALING CONTROL)
========================================================= */

export function generateSlugsByType(type: string): string[] {
    return generateAllKeywords()
        .filter((k) => k.type === type)
        .map((k) => k.slug);
}

export function generateSlugsByCountry(country: string): string[] {
    return generateAllKeywords()
        .filter((k) => k.country === country)
        .map((k) => k.slug);
}

/* =========================================================
   🔥 PAGINATION (VERY IMPORTANT FOR LARGE SCALE)
========================================================= */

export function generatePaginatedSlugs(
    page: number,
    limit: number
): string[] {
    const all = generateAllSlugs();

    const start = (page - 1) * limit;
    const end = start + limit;

    return all.slice(start, end);
}

/* =========================================================
   🔥 RANDOM SAMPLING (INDEXING STRATEGY)
========================================================= */

export function getRandomSlugs(count: number): string[] {
    const all = generateAllSlugs();

    return all.sort(() => 0.5 - Math.random()).slice(0, count);
}