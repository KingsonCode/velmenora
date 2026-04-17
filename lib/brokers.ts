/* ================= TYPES ================= */

import type { Broker, CountryCode, Region } from "@/lib/types/broker";

/* ================= DATA ================= */

import { BROKERS as RAW_BROKERS } from "@/lib/brokers-data";

/* ================= NORMALIZED ================= */

const BROKERS: Broker[] = RAW_BROKERS.filter(
    (b: Broker) => b.active !== false
);

/* ================= INDEX ================= */

const BROKER_MAP = new Map<string, Broker>(
    BROKERS.map((b) => [b.slug, b])
);

/* ================= HELPERS ================= */

function scoreBroker(b: Broker): number {
    return (b.priority || 0) * 2 + (b.rating || 0);
}

/* ================= CORE ================= */

export function getBroker(slug: string): Broker | null {
    return BROKER_MAP.get(slug) ?? null;
}

export function getAllBrokers(): Broker[] {
    return [...BROKERS].sort((a, b) => scoreBroker(b) - scoreBroker(a));
}

/* ================= GEO ================= */

export function getBrokersByCountry(
    country: CountryCode
): Broker[] {
    return BROKERS.filter((b) =>
        b.countries?.includes(country)
    );
}

export function getBrokersByRegion(
    region: Region
): Broker[] {
    return BROKERS.filter((b) =>
        b.regions?.includes(region)
    );
}

/* ================= TOP (FULL GEO FALLBACK) ================= */

export function getTopBrokers(
    country?: CountryCode,
    limit = 5
): Broker[] {
    let list: Broker[] = [];

    if (country) {
        const local = getBrokersByCountry(country);

        if (local.length > 0) {
            list = local;
        } else {
            const regional = getBrokersByRegion("AFRICA");

            if (regional.length > 0) {
                list = regional;
            } else {
                list = getBrokersByRegion("GLOBAL");
            }
        }
    } else {
        list = getBrokersByRegion("GLOBAL");
    }

    return list
        .sort((a, b) => scoreBroker(b) - scoreBroker(a))
        .slice(0, limit);
}

/* ================= RELATED ================= */

export function getRelatedBrokers(
    slug: string,
    limit = 3
): Broker[] {
    const current = getBroker(slug);
    if (!current) return [];

    return BROKERS
        .filter((b) => b.slug !== slug)
        .map((b) => {
            let score = scoreBroker(b);

            // 🎯 CATEGORY BOOST (ARRAY SAFE)
            if (
                current.category &&
                b.category?.some((c) =>
                    current.category.includes(c)
                )
            ) {
                score += 5;
            }

            // 🌍 REGION BOOST
            if (
                current.regions &&
                b.regions?.some((r) =>
                    current.regions!.includes(r)
                )
            ) {
                score += 3;
            }

            return { broker: b, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((x) => x.broker);
}

/* ================= LINK (AFFILIATE-FIRST) ================= */

export function getBrokerLink(
    broker: Broker,
    country?: CountryCode
): string {
    // 🎯 1. GEO AFFILIATE
    if (country && broker.affiliate?.geo?.[country]) {
        return broker.affiliate.geo[country]!;
    }

    // 🌍 2. DEFAULT AFFILIATE
    if (broker.affiliate?.default) {
        return broker.affiliate.default;
    }

    // 🧯 3. LEGACY FALLBACK
    if (country && broker.alt_urls?.[country]) {
        return broker.alt_urls[country];
    }

    return broker.url ?? "#";
}

/* ================= SMART PICK ================= */

export function getBestBrokerForCountry(
    country?: CountryCode
): Broker | null {
    return getTopBrokers(country, 1)[0] ?? null;
}