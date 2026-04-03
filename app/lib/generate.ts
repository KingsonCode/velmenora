import { countries } from "@/data/countries";
import { pageTypes } from "@/data/pageTypes";

// 🔥 generate all slugs
export function generateAllSlugs() {
    return countries.flatMap((country) =>
        pageTypes.map((type) => ({
            slug: `${type.key}-${country.slug}`,
            country,
            type,
        }))
    );
}

// 🔥 find page data from slug
export function getPageData(slug: string) {
    for (const country of countries) {
        for (const type of pageTypes) {
            const expected = `${type.key}-${country.slug}`;
            if (slug === expected) {
                return {
                    country,
                    type,
                    title: type.title(country.name),
                    description: type.description(country.name),
                };
            }
        }
    }

    return null;
}

// 🔥 helper for blog preview
export function getFeaturedPosts(limit = 6) {
    return generateAllSlugs()
        .slice(0, limit)
        .map((item) => ({
            title: item.type.title(item.country.name),
            slug: item.slug,
            excerpt: item.type.description(item.country.name),
        }));
}