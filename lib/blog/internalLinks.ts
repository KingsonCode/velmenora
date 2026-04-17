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

/* ================= HELPERS ================= */

function pickVariation(variations: string[], seed: string): string {
    if (variations.length === 0) return "";

    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }

    const selected = variations[hash % variations.length];

    return selected ?? "";
}

/* ================= CORE ENGINE ================= */

export function injectInternalLinks(
    content: string,
    country: string,
    currentSlug?: string
): string {
    if (!content) return content;
    if (!country) return content;

    const linkCount: Record<string, number> = {};

    for (const rule of LINK_RULES) {
        linkCount[rule.key] = 0;
    }

    /* 🔒 SPLIT BY HTML TAGS */
    const parts = content.split(/(<[^>]+>)/g);

    const processed = parts.map((part) => {
        if (!part || part.startsWith("<")) return part;

        let text = part;

        for (const rule of LINK_RULES) {
            if ((linkCount[rule.key] ?? 0) >= rule.limit) continue;

            const targetHref = rule.href(country);

            /* 🚫 avoid self-linking */
            if (currentSlug && targetHref === `/blog/${currentSlug}`) {
                continue;
            }

            /* 🚫 avoid linking same href repeatedly in same text node */
            if (text.includes(`href="${targetHref}"`)) {
                continue;
            }

            for (const pattern of rule.patterns) {
                if ((linkCount[rule.key] ?? 0) >= rule.limit) break;

                text = text.replace(pattern, (match) => {
                    if ((linkCount[rule.key] ?? 0) >= rule.limit) return match;

                    if (match.includes("<a ")) return match;

                    const anchorText = pickVariation(
                        rule.variations,
                        `${country}:${rule.key}:${match}:${currentSlug || ""}`
                    );

                    linkCount[rule.key] = (linkCount[rule.key] ?? 0) + 1;

                    return `<a href="${targetHref}" class="text-yellow-300 underline underline-offset-4 hover:text-yellow-200 transition-colors">${anchorText}</a>`;
                });
            }
        }

        return text;
    });

    return processed.join("");
}

/* ================= OPTIONAL RELATED LINKS BLOCK ================= */

export function appendRelatedLinksBlock(
    content: string,
    country: string,
    currentSlug?: string
): string {
    if (!content || !country) return content;

    const countryName = country
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

    const links = [
        {
            label: "Best Forex Brokers",
            href: `/blog/best-brokers-in-${country}`,
        },
        {
            label: "Low Spread Brokers",
            href: `/blog/low-spread-brokers-in-${country}`,
        },
        {
            label: "High Leverage Brokers",
            href: `/blog/high-leverage-brokers-in-${country}`,
        },
        {
            label: "How to Trade Forex",
            href: `/blog/how-to-trade-forex-in-${country}`,
        },
    ].filter((item) => {
        if (!currentSlug) return true;
        return item.href !== `/blog/${currentSlug}`;
    });

    const relatedHTML = `
    <section style="margin:40px 0 16px 0; padding:24px; border:1px solid rgba(255,255,255,0.10); border-radius:20px; background:rgba(255,255,255,0.03);">
        <h2 style="color:white; font-size:28px; margin:0 0 10px 0;">
            Related Guides
        </h2>

        <p style="color:#94a3b8; margin:0 0 16px 0;">
            Explore more trading guides for ${countryName}.
        </p>

        <ul style="margin:0; padding-left:18px; color:#cbd5e1; line-height:1.9;">
            ${links
            .map(
                (item) =>
                    `<li><a href="${item.href}" style="color:#fde68a; text-decoration:underline; text-underline-offset:4px;">${item.label}</a></li>`
            )
            .join("")}
        </ul>
    </section>
    `;

    return `${content}${relatedHTML}`;
}