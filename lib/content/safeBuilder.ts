import type { BuiltPageContent, FAQItem, BrokerCardData, JsonLd } from "./types";
import {
    buildBreadcrumbSchema,
    buildFAQSchema,
    buildRelatedLinks,
} from "./helpers";

type SafeBuilderInput = {
    lang?: string;
    baseUrl?: string;
    slug?: string;
    country: {
        name: string;
        slug: string;
    };
    broker: {
        name: string;
        slug: string;
    };
};

function buildSafeFaq(countryName: string, brokerName: string): FAQItem[] {
    return [
        {
            question: `Is ${brokerName} regulated for traders in ${countryName}?`,
            answer: `${brokerName} should be evaluated based on the legal entity serving your region, the regulation attached to that entity, and the protections available to traders.`,
        },
        {
            question: `Can traders in ${countryName} trust ${brokerName}?`,
            answer: `Trust depends on regulation, withdrawal consistency, platform reliability, execution quality, and long-term user experience rather than marketing claims alone.`,
        },
        {
            question: `How can I test whether ${brokerName} is safe?`,
            answer: `Start with a small deposit, verify withdrawal flow early, review fees carefully, and compare the broker with other established options serving your region.`,
        },
    ];
}

function buildSafeBrokerCards(broker: {
    slug: string;
    name: string;
}): BrokerCardData[] {
    const cards: BrokerCardData[] = [
        {
            slug: broker.slug,
            name: broker.name,
            description: `Review ${broker.name} features, trust profile, and trading fit.`,
            badge: "Reviewed",
        },
    ];

    if (broker.slug !== "exness") {
        cards.push({
            slug: "exness",
            name: "Exness",
            description: `Popular for accessibility, platform familiarity, and broad market reach.`,
        });
    }

    if (broker.slug !== "xm") {
        cards.push({
            slug: "xm",
            name: "XM",
            description: `Known by many traders for education, usability, and broker familiarity.`,
        });
    }

    return cards;
}

export function buildSafePage({
    lang = "en",
    baseUrl = "https://www.velmenora.com",
    slug,
    country,
    broker,
}: SafeBuilderInput): BuiltPageContent {
    const resolvedSlug = slug || `is-${broker.slug}-safe-in-${country.slug}`;
    const title = `Is ${broker.name} Safe in ${country.name}?`;
    const description = `A closer look at whether ${broker.name} is safe for traders in ${country.name}, including trust, regulation, platform strength, and practical trading considerations.`;

    const faq = buildSafeFaq(country.name, broker.name);

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
                title: `Is ${broker.name} Safe in ${country.name}?`,
                content: `${broker.name} should be judged through regulation, operating history, platform reliability, withdrawal consistency, and real trader experience. For traders in ${country.name}, safety also includes how practical the broker is in daily use.`,
            },
            {
                id: "regulation",
                title: "Regulation and Broker Trust",
                content: `A broker's safety profile depends heavily on licensing, transparency, and how clearly trading conditions are disclosed. Traders should review the entity serving their market, account protections, and any material warning signs before funding an account.`,
            },
            {
                id: "execution",
                title: "Execution, Withdrawals, and Platform Stability",
                content: `A broker can look strong on paper but still fail in practice through poor execution, unstable systems, or frustrating withdrawals. Real-world reliability matters just as much as brand strength.`,
            },
            {
                id: "practical-checks",
                title: "Practical Checks Before Opening an Account",
                content: `Before committing serious capital, test the broker with a smaller amount, confirm deposit and withdrawal behavior, review fees, and compare the overall experience against other brokers available in ${country.name}.`,
                variant: "note",
            },
        ],
        faq,
        schema,
        relatedLinks: buildRelatedLinks({
            countrySlug: country.slug,
            countryName: country.name,
            brokerSlug: broker.slug,
            brokerName: broker.name,
        }),
        brokerCards: buildSafeBrokerCards(broker),
        cta: {
            title: `Compare alternatives to ${broker.name}`,
            description: `See other brokers that may fit traders in ${country.name} based on cost, trust, and platform strength.`,
            href: `/best-forex-brokers-in-${country.slug}`,
            label: `Compare brokers in ${country.name}`,
            variant: "primary",
        },
    };
}