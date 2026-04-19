import { CountryCode, Broker } from "@/lib/types/broker";

/* =========================================
   DERIVED TYPES FROM BROKER MODEL
========================================= */

type BrokerFeature = NonNullable<Broker["features"]>[number];
type BrokerIntent = NonNullable<Broker["intent"]>[number];

/* =========================================
   BLOG CATEGORY
========================================= */

export type BlogCategory =
    | "ecn-brokers"
    | "low-spread-brokers"
    | "high-leverage-brokers"
    | "best-forex-brokers-for-beginners"
    | "fast-withdrawal-forex-brokers";

export type BlogCategoryFilter = {
    features?: BrokerFeature[];
    intent?: BrokerIntent;
};

export type BlogCategoryFaq = {
    question: string;
    answer: string;
};

export type BlogCategorySeo = {
    primaryKeyword: string;
    secondaryKeywords: string[];
};

export type BlogCategoryConfig = {
    title: string;
    description: string;
    heroTitle?: string;
    heroDescription?: string;
    intro: string;
    filter: BlogCategoryFilter;
    faq: BlogCategoryFaq[];
    seo: BlogCategorySeo;
};

export const CATEGORY_CONFIG: Record<BlogCategory, BlogCategoryConfig> = {
    "ecn-brokers": {
        title: "Best ECN Forex Brokers",
        description:
            "Compare the best ECN forex brokers with raw spreads, fast execution, and deep liquidity.",
        heroTitle: "Best ECN Forex Brokers",
        heroDescription:
            "Find top ECN brokers with tight pricing, better execution quality, and strong trading infrastructure.",
        intro:
            "ECN forex brokers are popular among scalpers, day traders, and advanced traders because they typically offer tighter spreads, deeper liquidity access, and more transparent execution conditions.",
        filter: {
            features: ["RAW_SPREAD", "FAST_EXECUTION"],
        },
        faq: [
            {
                question: "What is an ECN forex broker?",
                answer:
                    "An ECN broker routes orders through a network of liquidity providers instead of relying only on a dealing-desk model. This can result in tighter spreads and faster execution.",
            },
            {
                question: "Are ECN brokers good for scalping?",
                answer:
                    "Yes. ECN brokers are often preferred for scalping because of raw spreads, fast execution, and lower friction during active trading.",
            },
        ],
        seo: {
            primaryKeyword: "best ecn forex brokers",
            secondaryKeywords: [
                "ecn brokers",
                "raw spread forex brokers",
                "best brokers for scalping",
            ],
        },
    },

    "low-spread-brokers": {
        title: "Lowest Spread Forex Brokers",
        description:
            "Find forex brokers with the lowest spreads for scalping and day trading.",
        heroTitle: "Lowest Spread Forex Brokers",
        heroDescription:
            "Compare brokers with competitive spreads, low trading costs, and efficient execution for active traders.",
        intro:
            "Low-spread brokers help traders reduce transaction costs, especially in strategies where frequent entries and exits matter. Spread quality becomes even more important for scalpers and intraday traders.",
        filter: {
            features: ["LOW_SPREAD"],
        },
        faq: [
            {
                question: "Why do low spreads matter in forex trading?",
                answer:
                    "Lower spreads reduce the cost of entering and exiting trades. Over time, this can make a significant difference, especially for active traders.",
            },
            {
                question: "Do low spread brokers always have the lowest total cost?",
                answer:
                    "Not always. Some brokers offer raw spreads but charge commissions, so the real cost should be evaluated as spread plus commission plus execution quality.",
            },
        ],
        seo: {
            primaryKeyword: "low spread forex brokers",
            secondaryKeywords: [
                "lowest spread brokers",
                "tight spread forex brokers",
                "best brokers for day trading",
            ],
        },
    },

    "high-leverage-brokers": {
        title: "High Leverage Forex Brokers",
        description:
            "Trade with top forex brokers offering high leverage options worldwide.",
        heroTitle: "High Leverage Forex Brokers",
        heroDescription:
            "Explore brokers that offer higher leverage options, flexible account conditions, and broad product access.",
        intro:
            "High leverage can increase both opportunity and risk. Traders looking for higher leverage should evaluate regulation, margin policies, execution quality, and risk controls before choosing a broker.",
        filter: {
            features: ["HIGH_LEVERAGE"],
        },
        faq: [
            {
                question: "What is leverage in forex trading?",
                answer:
                    "Leverage allows traders to control a larger position using a smaller amount of capital. It can amplify both profits and losses.",
            },
            {
                question: "Are high leverage brokers suitable for beginners?",
                answer:
                    "Usually not by default. Beginners should use leverage carefully because risk can escalate very quickly.",
            },
        ],
        seo: {
            primaryKeyword: "high leverage forex brokers",
            secondaryKeywords: [
                "best high leverage brokers",
                "forex brokers with high leverage",
                "best leverage for forex",
            ],
        },
    },

    "best-forex-brokers-for-beginners": {
        title: "Best Forex Brokers for Beginners",
        description:
            "Beginner-friendly forex brokers with easy platforms, education, and low deposits.",
        heroTitle: "Best Forex Brokers for Beginners",
        heroDescription:
            "Compare beginner-friendly brokers with simple onboarding, educational tools, and accessible account options.",
        intro:
            "Beginners usually benefit from brokers with easy-to-use platforms, transparent fees, strong educational resources, responsive support, and manageable deposit requirements.",
        filter: {
            intent: "BEGINNER",
        },
        faq: [
            {
                question: "What makes a forex broker good for beginners?",
                answer:
                    "A beginner-friendly broker usually offers simple account setup, strong education, easy platforms, good support, and clear pricing.",
            },
            {
                question: "Should beginners focus only on bonuses?",
                answer:
                    "No. Regulation, withdrawal reliability, trading costs, and learning resources are usually more important than promotional bonuses.",
            },
        ],
        seo: {
            primaryKeyword: "best forex brokers for beginners",
            secondaryKeywords: [
                "beginner forex brokers",
                "forex brokers for new traders",
                "easy forex trading platform",
            ],
        },
    },

    "fast-withdrawal-forex-brokers": {
        title: "Fast Withdrawal Forex Brokers",
        description:
            "Top forex brokers with instant or same-day withdrawals and reliable payouts.",
        heroTitle: "Fast Withdrawal Forex Brokers",
        heroDescription:
            "Find brokers known for reliable payout processing, faster withdrawals, and convenient payment methods.",
        intro:
            "Fast withdrawals are a major trust signal. Traders often prefer brokers with a strong reputation for payout reliability, clear withdrawal policies, and accessible payment options.",
        filter: {
            features: ["INSTANT_WITHDRAWALS"],
        },
        faq: [
            {
                question: "Why do fast withdrawals matter?",
                answer:
                    "Fast withdrawals improve trust, liquidity access, and the overall trading experience, especially for active traders managing cash flow carefully.",
            },
            {
                question: "Do all brokers process withdrawals at the same speed?",
                answer:
                    "No. Speed can vary based on broker policy, payment method, verification status, and banking network delays.",
            },
        ],
        seo: {
            primaryKeyword: "fast withdrawal forex brokers",
            secondaryKeywords: [
                "instant withdrawal brokers",
                "same day withdrawal forex brokers",
                "best brokers for withdrawals",
            ],
        },
    },
};

export function isValidBlogCategory(value: string): value is BlogCategory {
    return value in CATEGORY_CONFIG;
}

export function getCategoryCountryTitle(
    baseTitle: string,
    countryName?: string
): string {
    return countryName ? `${baseTitle} in ${countryName}` : baseTitle;
}

export function getCategoryCountryDescription(
    baseDescription: string,
    countryName?: string
): string {
    if (!countryName) return baseDescription;

    return `${baseDescription} Traders in ${countryName} should compare spreads, execution, withdrawals, platform quality, and trust before choosing a broker.`;
}

/**
 * Optional helper ikiwa baadaye utataka country-specific metadata
 */
export function getCategorySeoTitle(
    category: BlogCategory,
    countryName?: string
): string {
    const config = CATEGORY_CONFIG[category];
    return getCategoryCountryTitle(config.title, countryName);
}

/**
 * Optional helper kwa page engine
 */
export function getCategorySeoDescription(
    category: BlogCategory,
    countryName?: string
): string {
    const config = CATEGORY_CONFIG[category];
    return getCategoryCountryDescription(config.description, countryName);
}