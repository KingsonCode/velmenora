import {
    CATEGORY_CONFIG,
    type BlogCategory,
    getCategoryCountryDescription,
    getCategoryCountryTitle,
} from "@/lib/blog/categories";

/* =========================================
   TYPES
========================================= */

export type ContentSection = {
    title: string;
    body: string[];
};

export type FaqItem = {
    question: string;
    answer: string;
};

export type InternalLinkAnchor = {
    href: string;
    label: string;
};

export type BlogCategoryContent = {
    title: string;
    description: string;
    heroTitle: string;
    heroDescription: string;
    intro: string;
    sections: ContentSection[];
    factors: string[];
    faq: FaqItem[];
    cta: {
        title: string;
        description: string;
        primaryLabel: string;
        secondaryLabel: string;
    };
    finalThoughts: string[];
    seo: {
        primaryKeyword: string;
        secondaryKeywords: string[];
    };
};

/* =========================================
   SMALL HELPERS
========================================= */

function appendCountryRelevance(text: string, countryName?: string): string {
    if (!countryName) return text;
    return `${text} This is especially relevant for traders in ${countryName}.`;
}

function buildCountrySpecificSuffix(countryName?: string): string {
    if (!countryName) return "";
    return ` If you are trading from ${countryName}, local payment convenience, support access, and broker fit for your market should also be part of the evaluation.`;
}

/* =========================================
   FACTORS
========================================= */

export function buildCategoryFactors(category: BlogCategory): string[] {
    switch (category) {
        case "ecn-brokers":
            return [
                "Raw spread availability",
                "Execution speed and slippage control",
                "Liquidity depth",
                "Trading platform stability",
                "Commission transparency",
            ];

        case "low-spread-brokers":
            return [
                "Average spread during major sessions",
                "Commission structure",
                "Execution quality",
                "Platform reliability",
                "Suitability for scalping",
            ];

        case "high-leverage-brokers":
            return [
                "Leverage options",
                "Margin requirements",
                "Risk controls",
                "Platform stability",
                "Regulation and trust",
            ];

        case "best-forex-brokers-for-beginners":
            return [
                "Ease of use",
                "Educational content",
                "Minimum deposit",
                "Customer support",
                "Account setup simplicity",
            ];

        case "fast-withdrawal-forex-brokers":
            return [
                "Withdrawal processing speed",
                "Local payment methods",
                "Fee transparency",
                "Payout reliability",
                "Support quality",
            ];

        default:
            return [
                "Regulation and trust",
                "Trading costs",
                "Execution speed",
                "Withdrawal reliability",
            ];
    }
}

function buildEvaluationFactors(category: BlogCategory): string[] {
    switch (category) {
        case "ecn-brokers":
            return [
                "Raw spreads and commission structure",
                "Execution speed during volatile market conditions",
                "Liquidity access and pricing consistency",
                "Platform stability for short-term trading",
                "Overall trust and order handling quality",
            ];

        case "low-spread-brokers":
            return [
                "Typical spreads on major pairs",
                "Commission plus spread total cost",
                "Execution quality under fast market moves",
                "Suitability for scalping and intraday trading",
                "Consistency of pricing during peak sessions",
            ];

        case "high-leverage-brokers":
            return [
                "Maximum leverage offered",
                "Margin requirements and liquidation rules",
                "Execution quality and slippage handling",
                "Risk controls and platform reliability",
                "Regulation and trader protection standards",
            ];

        case "best-forex-brokers-for-beginners":
            return [
                "Ease of account opening",
                "Platform simplicity and usability",
                "Educational materials and beginner support",
                "Minimum deposit and account flexibility",
                "Trust, withdrawals, and customer service",
            ];

        case "fast-withdrawal-forex-brokers":
            return [
                "Withdrawal processing times",
                "Available payment methods",
                "Fee transparency and payout policy",
                "Reliability of withdrawal approvals",
                "Support responsiveness during payout issues",
            ];

        default:
            return [
                "Trust and regulation",
                "Trading costs",
                "Execution quality",
                "Withdrawal reliability",
            ];
    }
}

/* =========================================
   SECTION BUILDERS
========================================= */

function buildWhyItMatters(category: BlogCategory, countryName?: string): string[] {
    switch (category) {
        case "ecn-brokers":
            return [
                appendCountryRelevance(
                    "ECN brokers matter because active traders usually care about tighter pricing, transparent execution, and the ability to trade in conditions that feel closer to the underlying market.",
                    countryName
                ),
                appendCountryRelevance(
                    "For scalpers and short-term traders, even small differences in spread and execution speed can affect long-term performance.",
                    countryName
                ),
            ];

        case "low-spread-brokers":
            return [
                appendCountryRelevance(
                    "Low-spread brokers are important because trading cost compounds over time. Small spread savings can become meaningful for traders who enter the market frequently.",
                    countryName
                ),
                appendCountryRelevance(
                    "This category is especially useful for scalpers, day traders, and traders focused on reducing friction in execution.",
                    countryName
                ),
            ];

        case "high-leverage-brokers":
            return [
                appendCountryRelevance(
                    "High leverage can expand opportunity, but it also increases risk. Traders should treat leverage as a tool, not as the main reason to trust a broker.",
                    countryName
                ),
                appendCountryRelevance(
                    "The strongest high leverage broker is not just the one offering the largest number, but the one combining leverage with trust, stable execution, and reliable withdrawals.",
                    countryName
                ),
            ];

        case "best-forex-brokers-for-beginners":
            return [
                appendCountryRelevance(
                    "Beginners benefit most from brokers that reduce confusion. That includes simple platforms, educational support, manageable costs, and a clean onboarding experience.",
                    countryName
                ),
                appendCountryRelevance(
                    "A broker that feels easy to use can help a new trader focus on learning the market instead of fighting the platform.",
                    countryName
                ),
            ];

        case "fast-withdrawal-forex-brokers":
            return [
                appendCountryRelevance(
                    "Withdrawal speed is one of the clearest real-world trust signals. Traders want confidence that they can access their funds smoothly when needed.",
                    countryName
                ),
                appendCountryRelevance(
                    "Fast withdrawals, clear payout rules, and reliable payment options often separate serious brokers from weak ones.",
                    countryName
                ),
            ];

        default:
            return [
                appendCountryRelevance(
                    "Choosing the right broker means comparing trust, trading conditions, and the overall fit for your goals.",
                    countryName
                ),
            ];
    }
}

function buildHowToChoose(category: BlogCategory, countryName?: string): string[] {
    const factors = buildEvaluationFactors(category);

    return [
        appendCountryRelevance(
            "The best way to evaluate brokers in this category is to compare them against the factors that directly affect your trading experience.",
            countryName
        ),
        `Focus on: ${factors.join(", ")}.`,
        appendCountryRelevance(
            "Instead of relying only on marketing claims, use category-specific comparison logic to narrow the list to brokers that actually match your priorities.",
            countryName
        ),
    ];
}

function buildLocalAngle(category: BlogCategory, countryName?: string): string[] {
    if (!countryName) {
        return [
            "For international traders, it also helps to compare platform quality, funding convenience, regulation, and the overall reliability of the broker before opening an account.",
        ];
    }

    switch (category) {
        case "fast-withdrawal-forex-brokers":
            return [
                `If you are trading from ${countryName}, payment convenience and payout reliability become even more important. A broker may look strong on paper but still perform poorly if withdrawals are slow or inconvenient in your market.`,
            ];

        case "best-forex-brokers-for-beginners":
            return [
                `For traders in ${countryName}, beginner-friendly brokers should also be judged on deposit convenience, accessible support, and how easy it is to start with a manageable account size.`,
            ];

        default:
            return [
                `If you are trading from ${countryName}, it is worth comparing not only spreads and features, but also local suitability, payment options, support quality, and withdrawal convenience.`,
            ];
    }
}

function buildFinalThoughts(_category: BlogCategory, countryName?: string): string[] {
    const shared = [
        "There is no single broker that is best for everyone.",
        "The strongest choice depends on what matters most for your strategy: cost, execution, leverage, support, or withdrawal reliability.",
        "That is why category-based broker research is more useful than relying on generic broker lists.",
    ];

    if (!countryName) return shared;

    return [
        ...shared,
        `If you are trading from ${countryName}, local market fit should also be part of the final decision.`,
    ];
}

/* =========================================
   CTA
========================================= */

function buildCta(category: BlogCategory, countryName?: string) {
    switch (category) {
        case "ecn-brokers":
            return {
                title: countryName
                    ? `Find the Right ECN Broker in ${countryName}`
                    : "Find the Right ECN Broker",
                description:
                    "Compare raw spread accounts, execution quality, and platform strength before opening an account.",
                primaryLabel: "Compare Top Brokers",
                secondaryLabel: "Read Broker Reviews",
            };

        case "low-spread-brokers":
            return {
                title: countryName
                    ? `Compare Low-Spread Brokers in ${countryName}`
                    : "Compare Low-Spread Brokers",
                description:
                    "Reduce trading friction by focusing on spread quality, commissions, and execution reliability.",
                primaryLabel: "See Top Picks",
                secondaryLabel: "Review Trading Costs",
            };

        case "high-leverage-brokers":
            return {
                title: countryName
                    ? `Explore High Leverage Brokers in ${countryName}`
                    : "Explore High Leverage Brokers",
                description:
                    "Balance opportunity with risk by choosing a broker that combines leverage with trust and execution quality.",
                primaryLabel: "Compare Brokers",
                secondaryLabel: "Read Full Reviews",
            };

        case "best-forex-brokers-for-beginners":
            return {
                title: countryName
                    ? `Start Trading with a Beginner-Friendly Broker in ${countryName}`
                    : "Start with a Beginner-Friendly Broker",
                description:
                    "Look for simplicity, strong education, and a platform that makes the learning process easier.",
                primaryLabel: "View Beginner Picks",
                secondaryLabel: "Read Beginner Reviews",
            };

        case "fast-withdrawal-forex-brokers":
            return {
                title: countryName
                    ? `Choose a Fast Withdrawal Broker in ${countryName}`
                    : "Choose a Fast Withdrawal Broker",
                description:
                    "Focus on payout reliability, payment convenience, and trust before making your final choice.",
                primaryLabel: "See Fast Payout Brokers",
                secondaryLabel: "Compare Withdrawal Options",
            };

        default:
            return {
                title: "Choose the Right Broker",
                description:
                    "Compare trust, costs, and platform quality before opening an account.",
                primaryLabel: "Compare Brokers",
                secondaryLabel: "Read Reviews",
            };
    }
}

/* =========================================
   MAIN CONTENT BUILDER
========================================= */

export function buildCategoryContent(
    category: BlogCategory,
    countryName?: string
): BlogCategoryContent {
    const config = CATEGORY_CONFIG[category];

    const title = getCategoryCountryTitle(config.title, countryName);
    const description = getCategoryCountryDescription(
        config.description,
        countryName
    );

    const heroTitle = getCategoryCountryTitle(
        config.heroTitle ?? config.title,
        countryName
    );

    const heroDescription = countryName
        ? `${config.heroDescription ?? config.description} Traders in ${countryName} should compare spreads, execution quality, trust, and withdrawal reliability before choosing a broker.`
        : config.heroDescription ?? config.description;

    return {
        title,
        description,
        heroTitle,
        heroDescription,
        intro: `${config.intro}${buildCountrySpecificSuffix(countryName)}`,
        sections: [
            {
                title: "Why This Category Matters",
                body: buildWhyItMatters(category, countryName),
            },
            {
                title: "How to Evaluate Brokers in This Category",
                body: buildHowToChoose(category, countryName),
            },
            {
                title: countryName
                    ? `What Traders in ${countryName} Should Also Consider`
                    : "What Traders Should Also Consider",
                body: buildLocalAngle(category, countryName),
            },
        ],
        factors: buildCategoryFactors(category),
        faq: config.faq,
        cta: buildCta(category, countryName),
        finalThoughts: buildFinalThoughts(category, countryName),
        seo: config.seo,
    };
}

/* =========================================
   SMALLER HELPERS
========================================= */

export function buildCategoryCompareIntro(
    category: BlogCategory,
    brokerA: string,
    brokerB: string,
    countryName?: string
): string {
    const categoryLabel = CATEGORY_CONFIG[category].title.toLowerCase();

    if (countryName) {
        return `${brokerA} vs ${brokerB} is a useful comparison for traders in ${countryName} looking at ${categoryLabel}. This comparison should focus on cost, execution quality, platform experience, trust, and market fit.`;
    }

    return `${brokerA} vs ${brokerB} is a useful comparison for traders researching ${categoryLabel}. The strongest choice depends on pricing, execution, trust, platform quality, and the overall fit for your trading goals.`;
}

export function buildCategoryBrokerIntro(
    category: BlogCategory,
    brokerName: string,
    countryName?: string
): string {
    const keyword = CATEGORY_CONFIG[category].seo.primaryKeyword;

    if (countryName) {
        return `${brokerName} is often considered when traders in ${countryName} search for ${keyword}. The key is to evaluate whether it truly matches local funding needs, trading conditions, and overall trust expectations.`;
    }

    return `${brokerName} often appears in conversations around ${keyword}. The right question is not only whether the broker is popular, but whether it fits the trading conditions and priorities that matter most in this category.`;
}

export function buildInternalLinkAnchors(lang: string): InternalLinkAnchor[] {
    return [
        {
            href: `/${lang}/country/blog/ecn-brokers`,
            label: "Best ECN Forex Brokers",
        },
        {
            href: `/${lang}/country/blog/low-spread-brokers`,
            label: "Lowest Spread Forex Brokers",
        },
        {
            href: `/${lang}/country/blog/high-leverage-brokers`,
            label: "High Leverage Forex Brokers",
        },
        {
            href: `/${lang}/country/blog/best-forex-brokers-for-beginners`,
            label: "Best Forex Brokers for Beginners",
        },
        {
            href: `/${lang}/country/blog/fast-withdrawal-forex-brokers`,
            label: "Fast Withdrawal Forex Brokers",
        },
    ];
}