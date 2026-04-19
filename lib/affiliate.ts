/* ================= TYPES ================= */

import type { Broker, CountryCode } from "@/lib/types/broker";

type Device = "mobile" | "tablet" | "desktop";

export type BuildAffiliateInput = {
    broker: Broker;
    country?: string;
    device?: Device;
    source?: string;
    blogSlug?: string;
};

/* ================= MONEY CONFIG ================= */

const VELMENORA_BASE_URL = "https://www.velmenora.com";
const GLOBAL_MONEY_BROKER = "exness";

const COUNTRY_TOP_BROKER: Record<string, string> = {
    TZ: "exness",
    KE: "exness",
    NG: "deriv",
    UG: "exness",
    GH: "exness",
    ZA: "exness",
    IN: "exness",
    PK: "exness",
};

/* ================= SAFE URL ================= */

function safeURL(raw: string): URL | null {
    try {
        return new URL(raw);
    } catch {
        return null;
    }
}

/* ================= NORMALIZATION ================= */

function normalizeCountry(country?: string): string | undefined {
    if (!country) return undefined;

    const normalized = country.trim().toUpperCase();

    if (!normalized) return undefined;
    return normalized;
}

/* ================= REGION RESOLUTION ================= */

function resolveRegion(country?: string): CountryCode | null {
    if (!country) return null;

    const AFRICA = ["TZ", "KE", "UG", "NG", "ZA", "GH"];
    const EUROPE = ["GB", "DE", "FR", "ES", "IT", "NL", "SE", "NO", "PL"];
    const MIDDLE_EAST = ["AE", "SA", "QA", "KW", "OM"];
    const ASIA = ["IN", "PK", "BD", "ID", "MY", "PH", "TH", "VN", "SG"];
    const AMERICAS = ["US", "CA", "BR", "MX", "AR", "CO", "CL"];

    if (AFRICA.includes(country)) return "AFRICA" as CountryCode;
    if (EUROPE.includes(country)) return "EUROPE" as CountryCode;
    if (MIDDLE_EAST.includes(country)) return "MIDDLE_EAST" as CountryCode;
    if (ASIA.includes(country)) return "ASIA" as CountryCode;
    if (AMERICAS.includes(country)) return "GLOBAL" as CountryCode;

    return "GLOBAL" as CountryCode;
}

/* ================= INTERNAL FALLBACK ================= */

function buildInternalGoUrl(
    brokerSlug: string,
    context: {
        source?: string;
        blogSlug?: string;
        device?: Device;
    }
): string {
    const url = new URL(`/go/${brokerSlug}`, VELMENORA_BASE_URL);

    if (context.source) url.searchParams.set("src", context.source);
    if (context.blogSlug) url.searchParams.set("slug", context.blogSlug);
    if (context.device) url.searchParams.set("device", context.device);

    return url.toString();
}

function getMoneyFallback(input: BuildAffiliateInput): string {
    const normalized = normalizeCountry(input.country);

    const brokerSlug =
        (normalized && COUNTRY_TOP_BROKER[normalized]) || GLOBAL_MONEY_BROKER;

    return buildInternalGoUrl(brokerSlug, {
        ...(input.source ? { source: input.source } : {}),
        ...(input.blogSlug ? { blogSlug: input.blogSlug } : {}),
        ...(input.device ? { device: input.device } : {}),
    });
}

/* ================= GEO ROUTING ================= */

function resolveBrokerURL(broker: Broker, country?: string): string {
    const normalizedCountry = normalizeCountry(country);
    const affiliate = broker.affiliate;
    const geo = affiliate?.geo;

    /* 0. EXACT COUNTRY GEO */
    if (normalizedCountry) {
        const exactCountryUrl = geo?.[normalizedCountry as CountryCode];
        if (exactCountryUrl) return exactCountryUrl;
    }

    /* 1. REGION GEO */
    const region = resolveRegion(normalizedCountry);
    if (region) {
        const regionUrl = geo?.[region];
        if (regionUrl) return regionUrl;
    }

    /* 2. GLOBAL GEO */
    const globalGeoUrl = geo?.["GLOBAL" as CountryCode];
    if (globalGeoUrl) return globalGeoUrl;

    /* 3. DEFAULT AFFILIATE */
    const defaultAffiliate = affiliate?.default;
    if (defaultAffiliate) return defaultAffiliate;

    /* 4. LEGACY ALT URL */
    if (normalizedCountry) {
        const legacyGeoUrl = broker.alt_urls?.[normalizedCountry as CountryCode];
        if (legacyGeoUrl) return legacyGeoUrl;
    }

    /* 5. DIRECT URL */
    if (broker.url) return broker.url;

    /* 6. NO DIRECT URL */
    return "";
}

/* ================= MAIN ================= */

export function buildAffiliateLink(input: BuildAffiliateInput): string {
    const { broker, country } = input;

    const rawUrl = resolveBrokerURL(broker, country);
    const url = safeURL(rawUrl);

    /* HARD FAIL SAFE */
    if (!url) {
        return getMoneyFallback(input);
    }

    return url.toString();
}