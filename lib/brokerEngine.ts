import { getAllBrokers as fetchAllBrokers } from "./brokers";

import type {
    Broker,
    CountryCode,
    Feature,
    PaymentMethod,
    Intent,
    Category,
} from "./types/broker";

import { scoreBroker } from "./rankingEngine";

/* ================= SAFE ================= */

export function isValidBrokerSlug(slug: string): boolean {
    return fetchAllBrokers().some((b) => b.slug === slug);
}

export function getBroker(slug: string): Broker {
    const broker = fetchAllBrokers().find((b) => b.slug === slug);

    if (!broker) {
        throw new Error(`Invalid broker slug: ${slug}`);
    }

    return broker;
}

/* ================= AFFILIATE ================= */

export function getAffiliateLink(
    broker: Broker,
    country: CountryCode = "GLOBAL"
): string {
    return (
        broker.affiliate.geo?.[country] ??
        broker.affiliate.default
    );
}

/* ================= CORE PIPELINE ================= */

type FilterOptions = {
    category?: Category;
    country?: CountryCode;
    intent?: Intent;
    feature?: Feature;
    payment?: PaymentMethod;
};

/* 🔥 MAIN ENGINE */
export function filterAndRankBrokers(options?: FilterOptions): Broker[] {
    let list = fetchAllBrokers();

    /* ================= FILTERS ================= */

    if (options?.category) {
        list = list.filter((b) =>
            b.category.includes(options.category!)
        );
    }

    if (options?.intent) {
        list = list.filter((b) =>
            b.intent?.includes(options.intent!) ?? false
        );
    }

    if (options?.feature) {
        list = list.filter((b) =>
            b.features.includes(options.feature!)
        );
    }

    if (options?.payment) {
        list = list.filter((b) =>
            b.payments.includes(options.payment!)
        );
    }

    if (options?.country) {
        list = list.filter(
            (b) =>
                !b.countries ||
                b.countries.includes(options.country!) ||
                b.countries.includes("GLOBAL")
        );
    }

    /* ================= RANK ================= */

    return list
        .map((b) => ({
            broker: b,
            score: scoreBroker(b, options),
        }))
        .sort((a, b) => b.score - a.score)
        .map((x) => x.broker);
}

/* ================= TOP ================= */

export function getTopBrokers(
    options?: FilterOptions & { limit?: number }
): Broker[] {
    const results = filterAndRankBrokers(options);

    if (results.length === 0) {
        return fetchAllBrokers()
            .map((b) => ({
                broker: b,
                score: scoreBroker(b),
            }))
            .sort((a, b) => b.score - a.score)
            .map((x) => x.broker)
            .slice(0, options?.limit ?? 3);
    }

    return results.slice(0, options?.limit ?? 3);
}

/* ================= SHORTCUTS ================= */

export const getBrokersByFeature = (feature: Feature) =>
    filterAndRankBrokers({ feature });

export const getBrokersByPayment = (payment: PaymentMethod) =>
    filterAndRankBrokers({ payment });

export const getBrokersByCountry = (country: CountryCode) =>
    filterAndRankBrokers({ country });

export const getBrokersByIntent = (intent: Intent) =>
    filterAndRankBrokers({ intent });

export const getBrokersByCategory = (category: Category) =>
    filterAndRankBrokers({ category });