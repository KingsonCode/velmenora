// 📁 /lib/generate.ts

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
};

/* =========================================================
   🔥 GENERATE ALL SLUGS
========================================================= */
export function generateAllSlugs() {
    return countries.flatMap((country) =>
        templates.map((tpl) => ({
            slug: `${tpl.type}-in-${country.slug}`,
        }))
    );
}

/* =========================================================
   🔥 GET PAGE DATA
========================================================= */
export function getPageData(slug: string): PageData | null {
    for (const country of countries) {
        for (const tpl of templates) {
            const expectedSlug = `${tpl.type}-in-${country.slug}`;

            if (slug === expectedSlug) {
                return {
                    slug,
                    title: tpl.generateTitle(country),
                    description: tpl.generateDescription(country),
                    country,
                    template: tpl,
                };
            }
        }
    }

    return null;
}