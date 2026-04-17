/* ================= IMPORTS ================= */

import { getAllBrokers, getTopBrokers } from "@/lib/brokers";
import type { Broker, CountryCode } from "@/lib/types/broker";

/* ================= COUNTRY LIST ================= */

export const SUPPORTED_COUNTRIES: CountryCode[] = [
    "TZ",
    "KE",
    "NG",
    "ZA",
    "GH",
    "UG",
];

/* ================= COUNTRY NAMES ================= */

export const COUNTRY_NAMES: Record<CountryCode, string> = {
    TZ: "Tanzania",
    KE: "Kenya",
    NG: "Nigeria",
    ZA: "South Africa",
    GH: "Ghana",
    UG: "Uganda",
    GLOBAL: "Global",
};

/* ================= SLUG → COUNTRY ================= */

const COUNTRY_SLUG_MAP: Record<string, CountryCode> = {
    tanzania: "TZ",
    kenya: "KE",
    nigeria: "NG",
    "south-africa": "ZA",
    ghana: "GH",
    uganda: "UG",

    // 🌍 fallback routes
    global: "GLOBAL",
    "united-kingdom": "GLOBAL",
    uk: "GLOBAL",
    usa: "GLOBAL",
    "united-states": "GLOBAL",
};

/* ================= RESOLVER ================= */

export function resolveCountry(slug: string): CountryCode {
    if (!slug) return "GLOBAL";

    const normalized = slug.toLowerCase().trim();

    return COUNTRY_SLUG_MAP[normalized] || "GLOBAL"; // 🔥 HARD FALLBACK
}

/* ================= ENGINE ================= */

export function getCountryPageData(country: CountryCode) {
    const name = COUNTRY_NAMES[country] || "Global";

    const allBrokers: Broker[] = getAllBrokers();

    /* ================= 1. PRIMARY ================= */
    let brokers: Broker[] = getTopBrokers(country, 5);

    /* ================= 2. STRICT COUNTRY ================= */
    if (!brokers.length) {
        brokers = allBrokers
            .filter((b) => b.countries?.includes(country))
            .slice(0, 5);
    }

    /* ================= 3. REGION FALLBACK ================= */
    if (!brokers.length) {
        const region =
            ["TZ", "KE", "UG", "NG", "ZA", "GH"].includes(country)
                ? "AFRICA"
                : country === "GLOBAL"
                    ? "GLOBAL"
                    : "GLOBAL";

        brokers = allBrokers
            .filter((b) => b.regions?.includes(region))
            .slice(0, 5);
    }

    /* ================= 4. GLOBAL FALLBACK ================= */
    if (!brokers.length) {
        brokers = allBrokers.slice(0, 5);
    }

    return {
        country,
        name,
        brokers,
    };
}