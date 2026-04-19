/* ================= IMPORTS ================= */

import { getAllBrokers, getTopBrokers } from "@/lib/brokers";
import type { Broker, CountryCode, Region } from "@/lib/types/broker";

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

export const COUNTRY_NAMES: Partial<Record<CountryCode, string>> = {
    TZ: "Tanzania",
    KE: "Kenya",
    NG: "Nigeria",
    ZA: "South Africa",
    GH: "Ghana",
    UG: "Uganda",

    AE: "United Arab Emirates",
    SA: "Saudi Arabia",

    IN: "India",
    PK: "Pakistan",
    BD: "Bangladesh",
    ID: "Indonesia",
    MY: "Malaysia",
    TH: "Thailand",
    VN: "Vietnam",
    PH: "Philippines",

    GLOBAL: "Global",
};

/* ================= REGION MAP ================= */

const REGION_MAP: Record<Region, CountryCode[]> = {
    AFRICA: ["TZ", "KE", "UG", "NG", "ZA", "GH"],
    MIDDLE_EAST: ["AE", "SA"],
    ASIA: ["IN", "PK", "BD", "ID", "MY", "TH", "VN", "PH"],
    EU: [],
    GLOBAL: ["GLOBAL"],
};

/* ================= GET REGION ================= */

function getRegion(country: CountryCode): Region {
    for (const [region, countries] of Object.entries(REGION_MAP) as [
        Region,
        CountryCode[]
    ][]) {
        if (countries.includes(country)) return region;
    }

    return "GLOBAL";
}

/* ================= SLUG → COUNTRY ================= */

const COUNTRY_SLUG_MAP: Record<string, CountryCode> = {
    tanzania: "TZ",
    kenya: "KE",
    nigeria: "NG",
    "south-africa": "ZA",
    ghana: "GH",
    uganda: "UG",

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

    return COUNTRY_SLUG_MAP[normalized] || "GLOBAL";
}

/* ================= MATCH LOGIC ================= */

function brokerMatchesCountry(b: Broker, country: CountryCode): boolean {
    if (b.countries?.includes(country)) return true;

    const region = getRegion(country);

    if (b.regions?.includes(region)) return true;
    if (b.regions?.includes("GLOBAL")) return true;

    return false;
}

/* ================= SELECT ENGINE ================= */

function selectBrokers(
    all: Broker[],
    country: CountryCode,
    limit: number
): Broker[] {
    /* 1. STRICT COUNTRY */
    let result = all.filter((b) => b.countries?.includes(country));

    if (result.length >= limit) return result.slice(0, limit);

    /* 2. REGION MATCH */
    const region = getRegion(country);

    result = all.filter((b) => b.regions?.includes(region));

    if (result.length >= limit) return result.slice(0, limit);

    /* 3. GLOBAL MATCH */
    result = all.filter((b) => b.regions?.includes("GLOBAL"));

    if (result.length >= limit) return result.slice(0, limit);

    /* 4. FALLBACK */
    return all.slice(0, limit);
}

/* ================= MAIN ENGINE ================= */

export function getCountryPageData(country: CountryCode) {
    const name = COUNTRY_NAMES[country] ?? "Global";

    const allBrokers: Broker[] = getAllBrokers();

    /* 🔥 PRIMARY (ranking aware) */
    let brokers: Broker[] = getTopBrokers(country, 5);

    /* 🔁 FALLBACK PIPELINE */
    if (!brokers.length) {
        brokers = selectBrokers(allBrokers, country, 5);
    }

    return {
        country,
        name,
        brokers,
    };
}