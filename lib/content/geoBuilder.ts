import type { BuiltPageContent, FAQItem, BrokerCardData, JsonLd } from "./types";
import {
    buildBreadcrumbSchema,
    buildFAQSchema,
    buildRelatedLinks,
} from "./helpers";

type GeoBuilderInput = {
    lang?: string;
    baseUrl?: string;
    slug?: string;
    country: {
        name: string;
        slug: string;
    };
};

function buildGeoFaq(countryName: string): FAQItem[] {
    return [
        {
            question: `What is the best forex broker in ${countryName}?`,
            answer: `The best broker depends on your goals, trading style, funding preferences, and the balance you want between trust, pricing, and platform usability.`,
        },
        {
            question: `How should I compare forex brokers in ${countryName}?`,
            answer: `Focus on trust, fees, platform quality, execution speed, payment methods, and overall suitability for your style of trading.`,
        },
        {
            question: `Are local payment methods important when choosing a broker?`,
            answer: `Yes. Funding convenience matters because deposits and withdrawals affect the real trading experience, not just the account setup stage.`,
        },
    ];
}

function buildGeoBrokerCards(): BrokerCardData[] {
    return [
        {
            slug: "exness",
            name: "Exness",
            description: `Commonly considered by traders looking for broad accessibility and familiarity.`,
            badge: "Popular",
        },
        {
            slug: "xm",
            name: "XM",
            description: `Often reviewed for beginner accessibility and well-known broker presence.`,
        },
        {
            slug: "deriv",
            name: "Deriv",
            description: `Relevant for traders exploring alternatives with a different platform mix.`,
        },
    ];
}

export function buildGeoPage({
    lang = "en",
    baseUrl = "https://velmenora.com",
    slug,
    country,
}: GeoBuilderInput): BuiltPageContent {
    const resolvedSlug = slug || `best-forex-brokers-in-${country.slug}`;
    const title = `Best Forex Brokers in ${country.name}`;
    const description = `Compare the best forex brokers in ${country.name}, including spreads, platforms, account features, and payment convenience.`;

    const faq = buildGeoFaq(country.name);

    const schema: JsonLd = [
        buildBreadcrumbSchema({
            baseUrl,
            lang,
            slug: resolvedSlug,
            title,
        }),
        buildFAQSchema(faq),
    ].filter(Boolean) as Record<string, unknown>[];

    return {
        title,
        description,
        sections: [
            {
                id: "overview",
                title: `Best Forex Brokers in ${country.name}`,
                content: `The best forex broker in ${country.name} depends on what matters most to the trader. Some prioritize low costs, others want strong platform tools, and many care about easy deposits and withdrawals.`,
            },
            {
                id: "selection",
                title: "How to Choose the Right Broker",
                content: `Compare brokers based on trust, spreads, leverage, account flexibility, platform strength, and whether they fit your experience level and trading strategy.`,
            },
            {
                id: "payments",
                title: "Deposits, Withdrawals, and Payment Convenience",
                content: `A broker should be practical in real use, not just impressive in marketing. Funding convenience, payment familiarity, and withdrawal consistency can make a major difference in day-to-day trading.`,
            },
            {
                id: "practical",
                title: "Practical Factors That Matter",
                content: `Beyond fees and brand recognition, traders should also assess support quality, ease of account funding, platform stability, and whether the broker feels sustainable for long-term use.`,
                variant: "note",
            },
        ],
        faq,
        schema,
        relatedLinks: buildRelatedLinks({
            countrySlug: country.slug,
            countryName: country.name,
        }),
        brokerCards: buildGeoBrokerCards(),
        cta: {
            title: `Start comparing brokers in ${country.name}`,
            description: `Review broker options before choosing an account.`,
            href: `/brokers`,
            label: "Compare brokers",
            variant: "primary",
        },
    };
}