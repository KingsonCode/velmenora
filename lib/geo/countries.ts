// /lib/geo/countries.ts

import { Cluster } from "./clusters";

/**
 * ISO Country Code (strict typing)
 */
export type CountryCode = keyof typeof COUNTRY_TO_CLUSTER;

/**
 * Country → Cluster mapping
 * ISO 3166-1 alpha-2 codes only
 */
export const COUNTRY_TO_CLUSTER = {
    // 🌍 AFRICA
    TZ: "AFRICA",
    KE: "AFRICA",
    UG: "AFRICA",
    NG: "AFRICA",
    GH: "AFRICA",
    ET: "AFRICA",
    RW: "AFRICA",
    ZM: "AFRICA",
    MW: "AFRICA",

    // 🇿🇦 SOUTH AFRICA
    ZA: "SOUTH_AFRICA",

    // 🌏 ASIA
    IN: "ASIA",
    PK: "ASIA",
    BD: "ASIA",
    ID: "ASIA",
    MY: "ASIA",
    TH: "ASIA",
    VN: "ASIA",
    PH: "ASIA",

    // 🕌 MIDDLE EAST
    AE: "MIDDLE_EAST",
    SA: "MIDDLE_EAST",
    QA: "MIDDLE_EAST",
    KW: "MIDDLE_EAST",
    OM: "MIDDLE_EAST",
    BH: "MIDDLE_EAST",

    // 🇪🇺 EUROPE
    DE: "EUROPE",
    FR: "EUROPE",
    ES: "EUROPE",
    IT: "EUROPE",
    NL: "EUROPE",
    BE: "EUROPE",
    SE: "EUROPE",
    NO: "EUROPE",
    FI: "EUROPE",
    DK: "EUROPE",
    PL: "EUROPE",
    PT: "EUROPE",
    GR: "EUROPE",

    // 🇦🇺 AU / CA
    AU: "AU_CA",
    NZ: "AU_CA",
    CA: "AU_CA"
} as const satisfies Record<string, Cluster>;

/**
 * Country metadata (extensible layer)
 */
export type CountryMeta = {
    code: CountryCode;
    name: string;
    cluster: Cluster;
    slug: string;
    currency?: string;
    language?: string;
    seo_slug?: string; // 🔥 future SEO routing
};

export const COUNTRY_META: Partial<Record<CountryCode, CountryMeta>> = {
    TZ: {
        code: "TZ",
        name: "Tanzania",
        cluster: "AFRICA",
        slug: "tanzania",
        currency: "TZS",
        language: "en",
        seo_slug: "tanzania"
    },
    KE: {
        code: "KE",
        name: "Kenya",
        cluster: "AFRICA",
        slug: "kenya",
        currency: "KES",
        language: "en",
        seo_slug: "kenya"
    },
    NG: {
        code: "NG",
        name: "Nigeria",
        cluster: "AFRICA",
        slug: "nigeria",
        currency: "NGN",
        language: "en",
        seo_slug: "nigeria"
    },
    ZA: {
        code: "ZA",
        name: "South Africa",
        cluster: "SOUTH_AFRICA",
        slug: "south-africa",
        currency: "ZAR",
        language: "en",
        seo_slug: "south-africa"
    },
    AE: {
        code: "AE",
        name: "United Arab Emirates",
        cluster: "MIDDLE_EAST",
        slug: "uae",
        currency: "AED",
        language: "ar",
        seo_slug: "uae"
    },
    DE: {
        code: "DE",
        name: "Germany",
        cluster: "EUROPE",
        slug: "germany",
        currency: "EUR",
        language: "de",
        seo_slug: "germany"
    }
};

/**
 * Get cluster safely
 */
export function getClusterByCountry(code?: string): Cluster {
    if (!code) return "GLOBAL";
    return COUNTRY_TO_CLUSTER[code as CountryCode] || "GLOBAL";
}

/**
 * Get metadata safely
 */
export function getCountryMeta(code?: string): CountryMeta | null {
    const normalized = normalizeCountryCode(code);
    if (!normalized) return null;
    return COUNTRY_META[normalized] || null;
}

/**
 * Normalize country code (VERY IMPORTANT for headers/IP)
 */
export function normalizeCountryCode(code?: string): CountryCode | null {
    if (!code) return null;
    const upper = code.toUpperCase();
    return (upper in COUNTRY_TO_CLUSTER ? upper : null) as CountryCode | null;
}
