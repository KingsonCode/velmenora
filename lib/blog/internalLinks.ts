import { BlogCategory } from "@/lib/blog/categories";

/* =========================================
   TYPES
========================================= */

type LinkRule = {
    key: string;
    patterns: RegExp[];
    href: (country: string) => string;
    variations: string[];
    limit: number;
};

/* =========================================
   CONFIG
========================================= */

const LINK_RULES: LinkRule[] = [
    {
        key: "best",
        patterns: [
            /\bbest brokers\b/i,
            /\bbest forex brokers\b/i,
            /\btop brokers\b/i,
            /\brecommended brokers\b/i,
        ],
        href: (country) => `/blog/best-brokers-in-${country}`,
        variations: [
            "best forex brokers",
            "top forex brokers",
            "recommended brokers",
        ],
        limit: 2,
    },
    {
        key: "spread",
        patterns: [
            /\blow spreads\b/i,
            /\blow spread brokers\b/i,
            /\btight spreads\b/i,
            /\blow-cost brokers\b/i,
        ],
        href: (country) => `/blog/low-spread-brokers-in-${country}`,
        variations: [
            "low spread brokers",
            "tight spread platforms",
            "lowest spread brokers",
        ],
        limit: 2,
    },
    {
        key: "leverage",
        patterns: [
            /\bhigh leverage\b/i,
            /\bhigh leverage brokers\b/i,
            /\bmaximum leverage\b/i,
        ],
        href: (country) => `/blog/high-leverage-brokers-in-${country}`,
        variations: [
            "high leverage brokers",
            "maximum leverage platforms",
        ],
        limit: 1,
    },
    {
        key: "guide",
        patterns: [
            /\bhow to trade forex\b/i,
            /\bforex trading guide\b/i,
            /\btrading guide\b/i,
            /\bforex basics\b/i,
        ],
        href: (country) => `/blog/how-to-trade-forex-in-${country}`,
        variations: [
            "how to trade forex",
            "forex trading guide",
            "beginner trading guide",
        ],
        limit: 2,
    },
];

/* =========================================
   HELPERS
========================================= */

function pickVariation(variations: string[], seed: string): string {
    if (!variations.length) return "";

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }

    return variations[hash % variations.length] || variations[0] || "";
}

function isInsideAnchor(text: string): boolean {
    return /<a\s/i.test(text);
}

function formatCountryName(country: string): string {
    return country
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");
}

/* =========================================
   CORE ENGINE
========================================= */

export function injectInternalLinks(
    content: string,
    country: string,
    currentSlug?: string
): string {
    if (!content || !country) return content;

    const linkCount: Record<string, number> = {};
    for (const rule of LINK_RULES) {
        linkCount[rule.key] = 0;
    }

    const parts = content.split(/(<[^>]+>)/g);

    const processed = parts.map((part) => {
        if (!part || part.startsWith("<")) return part;

        let text = part;

        for (const rule of LINK_RULES) {
            if ((linkCount[rule.key] ?? 0) >= rule.limit) continue;

            const href = rule.href(country);

            if (currentSlug && href.includes(currentSlug)) continue;

            for (const pattern of rule.patterns) {
                if ((linkCount[rule.key] ?? 0) >= rule.limit) break;

                text = text.replace(pattern, (match) => {
                    if ((linkCount[rule.key] ?? 0) >= rule.limit) return match;
                    if (isInsideAnchor(match)) return match;

                    const anchor = pickVariation(
                        rule.variations,
                        `${country}:${rule.key}:${match}:${currentSlug ?? ""}`
                    );

                    linkCount[rule.key] = (linkCount[rule.key] ?? 0) + 1;

                    return `<a href="${href}" class="text-yellow-300 underline underline-offset-4 hover:text-yellow-200 transition-colors">${anchor}</a>`;
                });
            }
        }

        return text;
    });

    return processed.join("");
}

/* =========================================
   RELATED BLOCK
========================================= */

export function appendRelatedLinksBlock(
    content: string,
    country: string,
    currentSlug?: string
): string {
    if (!content || !country) return content;

    const countryName = formatCountryName(country);

    const links = [
        { label: "Best Forex Brokers", href: `/blog/best-brokers-in-${country}` },
        { label: "Low Spread Brokers", href: `/blog/low-spread-brokers-in-${country}` },
        { label: "High Leverage Brokers", href: `/blog/high-leverage-brokers-in-${country}` },
        { label: "How to Trade Forex", href: `/blog/how-to-trade-forex-in-${country}` },
    ].filter((l) => !currentSlug || !l.href.includes(currentSlug));

    const html = `
<section class="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
  <h2 class="text-2xl font-semibold text-white mb-2">
    Related Guides
  </h2>

  <p class="text-gray-400 mb-4">
    Explore more trading guides for ${countryName}.
  </p>

  <ul class="space-y-2 text-sm">
    ${links
            .map(
                (l) =>
                    `<li><a href="${l.href}" class="text-yellow-300 underline underline-offset-4 hover:text-yellow-200">${l.label}</a></li>`
            )
            .join("")}
  </ul>
</section>
`;

    return content + html;
}

/* =========================================
   CATEGORY CLUSTER
========================================= */

export function getCategoryInternalLinks(
    lang: string,
    current: BlogCategory
) {
    const all: Array<{ slug: BlogCategory; label: string }> = [
        { slug: "ecn-brokers", label: "Best ECN Forex Brokers" },
        { slug: "low-spread-brokers", label: "Lowest Spread Forex Brokers" },
        { slug: "high-leverage-brokers", label: "High Leverage Forex Brokers" },
        {
            slug: "best-forex-brokers-for-beginners",
            label: "Best Forex Brokers for Beginners",
        },
        {
            slug: "fast-withdrawal-forex-brokers",
            label: "Fast Withdrawal Forex Brokers",
        },
    ];

    return all
        .filter((item) => item.slug !== current)
        .map((item) => ({
            slug: item.slug,
            label: item.label,
            href: `/${lang}/country/blog/${item.slug}`,
        }));
}