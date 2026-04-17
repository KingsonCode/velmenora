import { Broker } from "./types/broker";

const BASE_URL = "https://www.velmenora.com";

function url(path: string) {
    return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/* ================= REVIEW (UPGRADED) ================= */

export function buildReviewSchema(broker: Broker) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",

        name: broker.name,
        image: url(broker.logo),
        description: `${broker.name} review covering spreads, platforms, withdrawals, and trading conditions.`,
        brand: {
            "@type": "Brand",
            name: broker.name,
        },

        category: "Forex Broker",

        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: broker.rating,
            bestRating: 5,
            ratingCount: 137, // unaweza ku-dynamic baadaye
        },

        offers: {
            "@type": "Offer",
            url: url(`/${broker.slug}-review`),
            priceCurrency: "USD",
            price: broker.minDeposit,
            availability: "https://schema.org/InStock",
        },
    };
}

/* ================= FAQ ================= */

export type FAQItem = {
    q: string;
    a: string;
};

export function buildFAQSchema(faqs: FAQItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: f.a,
            },
        })),
    };
}

/* ================= COMPARISON (NEW 🔥) ================= */

export function buildComparisonSchema(a: Broker, b: Broker) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${a.name} vs ${b.name}`,
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: a.name,
                url: url(`/${a.slug}-review`),
            },
            {
                "@type": "ListItem",
                position: 2,
                name: b.name,
                url: url(`/${b.slug}-review`),
            },
        ],
    };
}

/* ================= BREADCRUMB (NEW 🔥) ================= */

export function buildBreadcrumbSchema(
    items: { name: string; path: string }[]
) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: url(item.path),
        })),
    };
}