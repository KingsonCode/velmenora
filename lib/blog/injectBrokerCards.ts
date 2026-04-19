import { Broker, CountryCode, Feature, Intent } from "@/lib/types/broker";
import { filterBrokers } from "@/lib/blog/filterBrokers";
import { BlogCategory } from "@/lib/blog/categories";

/* =========================================
   TYPES
========================================= */

type InjectInput = {
    content: string;
    category: BlogCategory;
    slug?: string;
    country?: string;
};

/* =========================================
   NORMALIZE COUNTRY
========================================= */

function normalizeCountry(country?: string): CountryCode | undefined {
    if (!country) return undefined;
    return country.toUpperCase() as CountryCode;
}

/* =========================================
   SAFE OBJECT BUILDER (🔥 KEY FIX)
========================================= */

function withCountry<T extends object>(
    input: T,
    country?: CountryCode
): T & Partial<{ country: CountryCode }> {
    return country ? { ...input, country } : input;
}

/* =========================================
   CATEGORY → FILTER MAP
========================================= */

function getCategoryFilter(category: BlogCategory): {
    features?: Feature[];
    intent?: Intent;
} {
    switch (category) {
        case "ecn-brokers":
            return { features: ["RAW_SPREAD", "FAST_EXECUTION"] };

        case "low-spread-brokers":
            return { features: ["LOW_SPREAD"] };

        case "high-leverage-brokers":
            return { features: ["HIGH_LEVERAGE"] };

        case "best-forex-brokers-for-beginners":
            return { intent: "BEGINNER" };

        case "fast-withdrawal-forex-brokers":
            return { features: ["INSTANT_WITHDRAWALS"] };

        default:
            return {};
    }
}

/* =========================================
   CARD TEMPLATE
========================================= */

function renderBrokerCard(broker: Broker, position: string): string {
    return `
<div class="my-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">

    <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-4">
            <img src="${broker.logo}" alt="${broker.name}" class="w-12 h-12 object-contain" />

            <div>
                <div class="text-white font-semibold text-lg">
                    ${broker.name}
                </div>

                <div class="text-sm text-gray-400">
                    ${broker.features?.slice(0, 2).join(" • ") || "Trusted broker"}
                </div>
            </div>
        </div>

        <div class="text-sm text-yellow-400 font-semibold">
            ⭐ ${broker.rating}
        </div>
    </div>

    <div class="flex flex-wrap gap-2 mb-5">
        ${(broker.features || [])
            .slice(0, 4)
            .map(
                (f) =>
                    `<span class="text-xs border border-white/10 px-2 py-1 rounded">${f.replace(/_/g, " ")}</span>`
            )
            .join("")}
    </div>

    <div class="flex gap-3">
        <a href="/brokers/${broker.slug}" 
           class="border border-white/15 px-4 py-2 rounded-lg text-sm">
           Review
        </a>

        <a href="/go/${broker.slug}?src=blog&pos=${position}" 
           data-track="broker-click"
           class="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium">
           Trade Now
        </a>
    </div>
</div>
`;
}

/* =========================================
   SECTION WRAPPER
========================================= */

function wrapSection(cards: string): string {
    return `
<section class="my-12">
    <div class="mb-4">
        <h2 class="text-2xl font-semibold text-white">
            Recommended Brokers
        </h2>
        <p class="text-gray-400 text-sm">
            Based on this guide’s trading focus and market conditions.
        </p>
    </div>

    ${cards}
</section>
`;
}

/* =========================================
   MAIN ENGINE
========================================= */

export function injectBrokerCards({
    content,
    category,
    slug,
    country,
}: InjectInput): string {
    if (!content) return content;

    const countryCode = normalizeCountry(country);
    const categoryFilter = getCategoryFilter(category);

    /* 🔥 STRICT SAFE CALL */
    const brokers = filterBrokers(
        withCountry(
            {
                ...categoryFilter,
                limit: 3,
                allowFallback: true,
            },
            countryCode
        )
    );

    if (!brokers.length) return content;

    const [top, mid, bottom] = brokers;

    const cardsHTML = wrapSection(
        [
            top ? renderBrokerCard(top, "top") : "",
            mid ? renderBrokerCard(mid, "middle") : "",
            bottom ? renderBrokerCard(bottom, "bottom") : "",
        ].join("")
    );

    let updated = content;

    /* =========================================
       INSERTION STRATEGY
    ========================================= */

    /* 1. After first H2 */
    const firstH2 = updated.indexOf("</h2>");
    if (firstH2 !== -1) {
        updated =
            updated.slice(0, firstH2 + 5) +
            cardsHTML +
            updated.slice(firstH2 + 5);
    }

    /* 2. Before conclusion */
    updated = updated.replace(
        /<h2>Conclusion<\/h2>/i,
        `${cardsHTML}<h2>Conclusion</h2>`
    );

    /* 3. Mid fallback */
    if (!updated.includes("Recommended Brokers")) {
        const parts = updated.split("</p>");
        if (parts.length > 3) {
            const midIndex = Math.floor(parts.length / 2);
            parts.splice(midIndex, 0, cardsHTML);
            updated = parts.join("</p>");
        }
    }

    return updated;
}