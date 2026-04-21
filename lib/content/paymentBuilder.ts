import type { BuiltPageContent, FAQItem, BrokerCardData, JsonLd } from "./types";
import {
    buildBreadcrumbSchema,
    buildFAQSchema,
    buildRelatedLinks,
} from "./helpers";

type PaymentBuilderInput = {
    lang?: string;
    baseUrl?: string;
    slug?: string;
    country: {
        name: string;
        slug: string;
    };
    payment: string;
};

function formatPaymentLabel(payment: string): string {
    const normalized = payment.toLowerCase().trim();

    const specialLabels: Record<string, string> = {
        mpesa: "M-Pesa",
        tigopesa: "Tigo Pesa",
        "airtel-money": "Airtel Money",
        "mobile-money": "Mobile Money",
        bank: "Bank Transfer",
        card: "Credit/Debit Card",
        crypto: "Crypto",
        eft: "EFT",
        upi: "UPI",
        bkash: "bKash",
        nagad: "Nagad",
    };

    return (
        specialLabels[normalized] ||
        normalized
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ")
    );
}

function buildPaymentFaq(
    countryName: string,
    paymentLabel: string
): FAQItem[] {
    return [
        {
            question: `Which forex brokers support ${paymentLabel} in ${countryName}?`,
            answer: `That depends on the broker, the region-specific entity serving the trader, and which deposit or withdrawal methods are currently available.`,
        },
        {
            question: `Is ${paymentLabel} good for forex trading deposits?`,
            answer: `${paymentLabel} can be useful when it provides convenience and reliable account funding, but it should still be weighed against fees, withdrawal quality, and broker trust.`,
        },
        {
            question: `Should payment support decide which broker I choose?`,
            answer: `It should be one factor, but not the only one. Regulation, execution quality, platform strength, and withdrawal consistency still matter a great deal.`,
        },
    ];
}

function buildPaymentBrokerCards(): BrokerCardData[] {
    return [
        {
            slug: "exness",
            name: "Exness",
            description: `Frequently checked by traders who care about usability and funding convenience.`,
            badge: "Popular",
        },
        {
            slug: "xm",
            name: "XM",
            description: `Often considered by traders comparing broker accessibility and account convenience.`,
        },
        {
            slug: "deriv",
            name: "Deriv",
            description: `Useful as an alternative broker to compare when payment flow matters.`,
        },
    ];
}

export function buildPaymentPage({
    lang = "en",
    baseUrl = "https://www.velmenora.com",
    slug,
    country,
    payment,
}: PaymentBuilderInput): BuiltPageContent {
    const resolvedSlug = slug || `forex-brokers-with-${payment}-in-${country.slug}`;
    const paymentLabel = formatPaymentLabel(payment);
    const title = `Forex Brokers with ${paymentLabel} in ${country.name}`;
    const description = `Explore forex brokers that support ${paymentLabel} in ${country.name}, including funding convenience, withdrawals, and trading access.`;

    const faq = buildPaymentFaq(country.name, paymentLabel);

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
                title: `Forex Brokers with ${paymentLabel} in ${country.name}`,
                content: `Many traders in ${country.name} care deeply about payment convenience. Brokers that support ${paymentLabel} may offer a smoother path for deposits and withdrawals, which improves day-to-day trading usability.`,
            },
            {
                id: "importance",
                title: `Why ${paymentLabel} Matters for Traders`,
                content: `Payment support is not only about speed. It also affects accessibility, comfort, funding habits, and how smoothly traders can move money in and out of a trading account.`,
            },
            {
                id: "comparison",
                title: `How to Compare Brokers That Support ${paymentLabel}`,
                content: `Look at deposit speed, withdrawal handling, fees, minimum funding requirements, and whether the broker combines payment convenience with trust and strong trading conditions.`,
            },
            {
                id: "final-check",
                title: "Final Checks Before You Open an Account",
                content: `Before funding a live account, verify that the payment method works as expected, confirm any fees or limits, and test the process with a smaller amount first.`,
                variant: "note",
            },
        ],
        faq,
        schema,
        relatedLinks: buildRelatedLinks({
            countrySlug: country.slug,
            countryName: country.name,
            payment,
        }),
        brokerCards: buildPaymentBrokerCards(),
        cta: {
            title: `Compare more brokers in ${country.name}`,
            description: `See brokers by funding convenience, trading costs, and overall trading fit.`,
            href: `/best-forex-brokers-in-${country.slug}`,
            label: `View brokers in ${country.name}`,
            variant: "primary",
        },
    };
}