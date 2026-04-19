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

/* ================= COUNTRY GUARD ================= */

const COUNTRY_SET = new Set<CountryCode>(
    BROKERS.flatMap((b) => b.countries ?? [])
);

export function isValidCountry(value: string): value is CountryCode {
    return COUNTRY_SET.has(value.toUpperCase() as CountryCode);
}

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

export function getBrokersByCountry(country: CountryCode): Broker[] {
    return BROKERS.filter((b) => b.countries?.includes(country));
}

export function getBrokersByRegion(region: Region): Broker[] {
    return BROKERS.filter((b) => b.regions?.includes(region));
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
            const global = getBrokersByRegion("GLOBAL");
            list = global.length > 0 ? global : BROKERS;
        }
    } else {
        const global = getBrokersByRegion("GLOBAL");
        list = global.length > 0 ? global : BROKERS;
    }

    return [...list]
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

    const currentCategories = current.category ?? [];
    const currentRegions = current.regions ?? [];

    return BROKERS
        .filter((b) => b.slug !== slug)
        .map((b) => {
            let score = scoreBroker(b);

            if (
                currentCategories.length > 0 &&
                b.category?.some((c) => currentCategories.includes(c))
            ) {
                score += 5;
            }

            if (
                currentRegions.length > 0 &&
                b.regions?.some((r) => currentRegions.includes(r))
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
    const geoUrl = country ? broker.affiliate?.geo?.[country] : undefined;
    if (geoUrl) return geoUrl;

    const defaultAffiliate = broker.affiliate?.default;
    if (defaultAffiliate) return defaultAffiliate;

    const legacyGeoUrl = country ? broker.alt_urls?.[country] : undefined;
    if (legacyGeoUrl) return legacyGeoUrl;

    if (broker.url) return broker.url;

    return "/";
}

/* ================= SMART PICK ================= */

export function getBestBrokerForCountry(
    country?: CountryCode
): Broker | null {
    return getTopBrokers(country, 1)[0] ?? null;
}