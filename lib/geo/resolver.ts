// /lib/geo/resolver.ts

import {
    normalizeCountryCode,
    getCountryMeta,
    getClusterByCountry
} from "./countries";
import { CLUSTERS, Cluster, ClusterConfig } from "./clusters";

/* ================= TYPES ================= */

type AnyRequest = {
    headers?: { get?: (key: string) => string | null };
    nextUrl?: { searchParams?: URLSearchParams };
    cookies?: { get?: (key: string) => { value?: string } | undefined };
};

export type GeoResult = {
    country: string | null;
    cluster: Cluster;
    config: ClusterConfig;
    meta: ReturnType<typeof getCountryMeta>;
    source: "query" | "header" | "cookie" | "manual" | "fallback";

    /* 🔥 DIRECT ACCESS */
    language: string;
    brokers: string[];
    payments: string[];
    intent: "beginner" | "pro";
};

/* ================= DETECTORS ================= */

/**
 * 🔥 SAFE HEADER DETECTION (NO CRASH EVER)
 */
function detectCountryFromHeaders(req: AnyRequest): string | null {
    const headers = req?.headers;

    if (!headers || typeof headers.get !== "function") {
        return null;
    }

    const candidates = [
        headers.get("x-vercel-ip-country"),
        headers.get("cf-ipcountry"),
        headers.get("x-country"),
        headers.get("x-forwarded-country")
    ];

    for (const c of candidates) {
        const normalized = normalizeCountryCode(c || undefined);
        if (normalized) return normalized;
    }

    return null;
}

/**
 * 🔥 SAFE QUERY DETECTION
 */
function detectCountryFromQuery(req: AnyRequest): string | null {
    const params = req?.nextUrl?.searchParams;
    if (!params) return null;

    const country = params.get("country");
    return normalizeCountryCode(country || undefined);
}

/**
 * 🔥 SAFE COOKIE DETECTION
 */
function detectCountryFromCookie(req: AnyRequest): string | null {
    const cookie = req?.cookies?.get?.("geo_country")?.value;
    return normalizeCountryCode(cookie);
}

/* ================= MAIN ================= */

export function resolveGeo(
    input?: AnyRequest | string
): GeoResult {

    let country: string | null = null;
    let source: GeoResult["source"] = "fallback";

    /* ================= MODE SWITCH ================= */

    if (typeof input === "string") {
        // 👉 Manual mode
        const normalized = normalizeCountryCode(input);
        if (normalized) {
            country = normalized;
            source = "manual";
        }
    }

    else if (input) {
        const req = input;

        // 1. Query (highest priority)
        const queryCountry = detectCountryFromQuery(req);
        if (queryCountry) {
            country = queryCountry;
            source = "query";
        }

        // 2. Headers
        if (!country) {
            const headerCountry = detectCountryFromHeaders(req);
            if (headerCountry) {
                country = headerCountry;
                source = "header";
            }
        }

        // 3. Cookie
        if (!country) {
            const cookieCountry = detectCountryFromCookie(req);
            if (cookieCountry) {
                country = cookieCountry;
                source = "cookie";
            }
        }
    }

    /* ================= FALLBACK ================= */

    if (!country) {
        country = null;
        source = "fallback";
    }

    const cluster = getClusterByCountry(country || undefined);
    const config = CLUSTERS[cluster];
    const meta = getCountryMeta(country || undefined);

    /* ================= DERIVED ================= */

    const brokers = [
        config.broker_priority.primary,
        config.broker_priority.secondary,
        config.broker_priority.tertiary,
    ];

    const payments = config.payment_methods;

    const intent =
        config.behavior.trust_level === "low"
            ? "beginner"
            : "pro";

    /* ================= RESULT ================= */

    return {
        country,
        cluster,
        config,
        meta,
        source,

        language: config.language,
        brokers,
        payments,
        intent,
    };
}