type LinkRule = {
    key: string;
    patterns: RegExp[];
    href: (country: string) => string;
    variations: string[];
    limit: number;
};

/* ================= CONFIG ================= */

const LINK_RULES: LinkRule[] = [
    {
        key: "best",
        patterns: [
            /\bbest brokers\b/i,
            /\bbest forex brokers\b/i,
            /\btop brokers\b/i,
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

/* ================= CORE ENGINE ================= */

export function injectInternalLinks(
    content: string,
    country: string
): string {
    if (!content) return content;

    let linkCount: Record<string, number> = {};

    // initialize counters
    LINK_RULES.forEach((rule) => {
        linkCount[rule.key] = 0;
    });

    /* 🔒 SPLIT BY HTML TAGS (IMPORTANT) */
    const parts = content.split(/(<[^>]+>)/g);

    /* 🎯 PROCESS ONLY TEXT NODES */
    const processed = parts.map((part) => {
        // skip HTML tags
        if (part.startsWith("<")) return part;

        let text = part;

        for (const rule of LINK_RULES) {
            if ((linkCount[rule.key] ?? 0) >= rule.limit) continue;

            for (const pattern of rule.patterns) {
                if ((linkCount[rule.key] ?? 0) >= rule.limit) break;

                text = text.replace(pattern, (match) => {
                    if ((linkCount[rule.key] ?? 0) >= rule.limit) return match;

                    const variation =
                        rule.variations[
                        Math.floor(Math.random() * rule.variations.length)
                        ];

                    linkCount[rule.key] = (linkCount[rule.key] ?? 0) + 1;

                    return `<a href="${rule.href(country)}">${variation}</a>`;
                });
            }
        }

        return text;
    });

    return processed.join("");
}