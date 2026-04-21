import {
    normalizeCountryCode,
    getCountryMeta,
    getClusterByCountry,
} from "./countries";
import type { CountryCode } from "./countries";
import { CLUSTERS, Cluster, ClusterConfig } from "./clusters";

/* ================= TYPES ================= */

export type AnyRequest = {
    headers?: { get?: (key: string) => string | null };
    nextUrl?: { searchParams?: URLSearchParams };
    cookies?: { get?: (key: string) => { value?: string } | undefined };
};

export type GeoResult = {
    country: CountryCode | null;
    cluster: Cluster;
    config: ClusterConfig;
    meta: ReturnType<typeof getCountryMeta>;
    source: "query" | "header" | "cookie" | "manual" | "fallback";

    language: string;
    brokers: string[];
    payments: string[];
    intent: "beginner" | "pro";
};

/* ================= INTERNAL HELPERS ================= */

function normalizeDetectedCountry(value?: string | null): CountryCode | null {
    return normalizeCountryCode(value || undefined);
}

/* ================= DETECTORS ================= */

function detectCountryFromHeaders(req: AnyRequest): CountryCode | null {
    const h = req?.headers;

    if (!h || typeof h.get !== "function") {
        return null;
    }

    const candidates = [
        h.get("x-vercel-ip-country"),
        h.get("cf-ipcountry"),
        h.get("x-geo-country"),
        h.get("x-country-code"),
        h.get("x-country"),
        h.get("x-forwarded-country"),
    ];

    for (const candidate of candidates) {
        const normalized = normalizeDetectedCountry(candidate);
        if (normalized) return normalized;
    }

    return null;
}

function detectCountryFromQuery(req: AnyRequest): CountryCode | null {
    const params = req?.nextUrl?.searchParams;
    if (!params) return null;

    const country =
        params.get("country") ||
        params.get("geo") ||
        params.get("region");

    return normalizeDetectedCountry(country);
}

function detectCountryFromCookie(req: AnyRequest): CountryCode | null {
    const cookie =
        req?.cookies?.get?.("geo_country")?.value ||
        req?.cookies?.get?.("country")?.value;

    return normalizeDetectedCountry(cookie);
}

/* ================= CORE RESOLVER ================= */

export function resolveGeo(input?: AnyRequest | string): GeoResult {
    let country: CountryCode | null = null;
    let source: GeoResult["source"] = "fallback";

    if (typeof input === "string") {
        const normalized = normalizeDetectedCountry(input);
        if (normalized) {
            country = normalized;
            source = "manual";
        }
    } else if (input) {
        const req = input;

        const queryCountry = detectCountryFromQuery(req);
        if (queryCountry) {
            country = queryCountry;
            source = "query";
        }

        if (!country) {
            const headerCountry = detectCountryFromHeaders(req);
            if (headerCountry) {
                country = headerCountry;
                source = "header";
            }
        }

        if (!country) {
            const cookieCountry = detectCountryFromCookie(req);
            if (cookieCountry) {
                country = cookieCountry;
                source = "cookie";
            }
        }
    }

    if (!country) {
        country = null;
        source = "fallback";
    }

    const cluster = getClusterByCountry(country || undefined);
    const config = CLUSTERS[cluster];
    const meta = getCountryMeta(country || undefined);

    const brokers = [
        config.broker_priority.primary,
        config.broker_priority.secondary,
        config.broker_priority.tertiary,
    ].filter(Boolean);

    const payments = config.payment_methods;

    const intent: "beginner" | "pro" =
        config.behavior.trust_level === "low" ? "beginner" : "pro";

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