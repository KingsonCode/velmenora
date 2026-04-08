import { countries, type Country } from "./countries";
import { templates, type Template } from "./templates";

/* =========================================================
   🔥 TYPES
========================================================= */
export type PageData = {
    slug: string;
    title: string;
    description: string;
    country: Country;
    template: Template;
    keyword: string;
    type: string;
};

/* =========================================================
   🔥 GENERATE ALL SLUGS (STATIC PATHS)
========================================================= */
export function generateAllSlugs() {
    return countries.flatMap((country) =>
        templates.map((tpl) => ({
            slug: `${tpl.type}-in-${country.slug}`,
        }))
    );
}

/* =========================================================
   🔥 GENERATE ALL PAGES (NEW - FULL DATA)
========================================================= */
export function generatePages(): PageData[] {
    const pages: PageData[] = [];

    for (const country of countries) {
        for (const tpl of templates) {
            const slug = `${tpl.type}-in-${country.slug}`;

            const keyword = tpl.generateTitle(country);

            pages.push({
                slug,
                title: tpl.generateTitle(country),
                description: tpl.generateDescription(country),
                country,
                template: tpl,
                keyword,
                type: tpl.type,
            });
        }
    }

    return pages;
}

/* =========================================================
   🔥 GET PAGE DATA (FAST LOOKUP)
========================================================= */
export function getPageData(slug: string): PageData | null {
    const pages = generatePages();
    return pages.find((p) => p.slug === slug) || null;
}