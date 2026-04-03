/* =========================================================
   🔥 DATA SOURCE (COUNTRIES)
========================================================= */

const countries = [
    { name: "Kenya", slug: "kenya" },
    { name: "Nigeria", slug: "nigeria" },
    { name: "Tanzania", slug: "tanzania" },
];

/* =========================================================
   🔥 TEMPLATES (PAGE TYPES)
========================================================= */

const templates = [
    {
        type: "how-to-trade",
        title: (c: any) => `How to Trade Forex in ${c.name}`,
        description: (c: any) =>
            `Learn how to trade forex in ${c.name} step by step.`,
    },
    {
        type: "is-exness-legit",
        title: (c: any) => `Is Exness Legit in ${c.name}?`,
        description: (c: any) =>
            `Full review of Exness broker in ${c.name}.`,
    },
];

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
   🔥 GET PAGE DATA (MATCH SLUG)
========================================================= */

export function getPageData(slug: string) {
    for (const country of countries) {
        for (const tpl of templates) {
            const expectedSlug = `${tpl.type}-in-${country.slug}`;

            if (slug === expectedSlug) {
                return {
                    title: tpl.title(country),
                    description: tpl.description(country),
                    country,
                };
            }
        }
    }

    return null;
}