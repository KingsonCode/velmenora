/* ================= TYPES ================= */

import type { Broker } from "@/lib/types/broker";

type Device = "mobile" | "tablet" | "desktop";

type BuildAffiliateInput = {
    broker: Broker;
    country?: string;
    device?: Device;
    source?: string;
};

/* ================= MONEY CONFIG ================= */

/* 🔥 CORE MONEY CONTROL */
const GLOBAL_MONEY_BROKER = "exness";

const COUNTRY_TOP_BROKER: Record<string, string> = {
    TZ: "exness",
    KE: "exness",
    NG: "deriv",
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

/* ================= GEO HELPERS ================= */

function normalizeCountry(country?: string): string | undefined {
    if (!country) return undefined;
    return country.toUpperCase();
}

function resolveRegion(country?: string): string | null {
    if (!country) return null;

    const AFRICA = ["TZ", "KE", "UG", "NG", "ZA", "GH"];
    const EU = ["GB", "DE", "FR", "ES", "IT"];
    const UAE = ["AE", "SA", "QA"];

    if (AFRICA.includes(country)) return "AFRICA";
    if (EU.includes(country)) return "EU";
    if (UAE.includes(country)) return "MIDDLE_EAST";

    return "GLOBAL";
}

/* ================= MONEY FALLBACK ================= */

function getMoneyFallback(country?: string): string {
    const c = normalizeCountry(country);

    const brokerSlug =
        (c && COUNTRY_TOP_BROKER[c]) || GLOBAL_MONEY_BROKER;

    return `https://www.velmenora.com/go/${brokerSlug}`;
}

/* ================= CORE ROUTING ENGINE ================= */

function resolveBrokerURL(
    broker: Broker,
    country?: string
): string {
    const c = normalizeCountry(country);

    const affiliate = broker.affiliate;
    const geo = affiliate?.geo;

    /* ================= 0. NO AFFILIATE ================= */
    if (!affiliate) {
        console.warn(`❌ NO AFFILIATE → ${broker.slug}`);
        return getMoneyFallback(c);
    }

    /* ================= 1. EXACT COUNTRY ================= */
    if (c && geo && c in geo) {
        const url = geo[c as keyof typeof geo];
        if (url) return url;
    }

    /* ================= 2. REGION ================= */
    const region = resolveRegion(c);

    if (region && geo && region in geo) {
        const url = geo[region as keyof typeof geo];
        if (url) return url;
    }

    /* ================= 3. GLOBAL ================= */
    if (geo?.GLOBAL) {
        return geo.GLOBAL;
    }

    /* ================= 4. DEFAULT ================= */
    if (affiliate.default) {
        return affiliate.default;
    }

    /* ================= 5. LAST RESORT ================= */
    console.warn(`⚠️ NO GEO/DEFAULT → ${broker.slug}`);
    return getMoneyFallback(c);
}

/* ================= MAIN ================= */

export function buildAffiliateLink({
    broker,
    country,
    device,
    source,
}: BuildAffiliateInput): string {
    const rawUrl = resolveBrokerURL(broker, country);

    const url = safeURL(rawUrl);

    /* 🔴 HARD FAIL SAFE */
    if (!url) {
        return "https://www.velmenora.com";
    }

    /* ================= TRACKING ================= */

    url.searchParams.set("utm_source", "velmenora");
    url.searchParams.set("utm_medium", "affiliate");
    url.searchParams.set("utm_campaign", broker.slug);

    if (source) {
        url.searchParams.set("utm_content", source);
    }

    if (country) {
        url.searchParams.set("geo", country);
    }

    if (device) {
        url.searchParams.set("device", device);
    }

    /* 🔥 CACHE BUSTER */
    url.searchParams.set("ts", Date.now().toString());

    return url.toString();
}