import { Cluster } from "./clusters";

/* ================= TYPES ================= */

export type CountryCode = keyof typeof COUNTRY_TO_CLUSTER;

export type CountryMeta = {
    code: CountryCode;
    name: string;
    cluster: Cluster;
    slug: string;
    currency?: string;
    language?: string;
    seo_slug?: string;
};

/* ================= COUNTRY → CLUSTER ================= */

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
    CA: "AU_CA",
} as const satisfies Record<string, Cluster>;

/* ================= COUNTRY META ================= */

export const COUNTRY_META: Partial<Record<CountryCode, CountryMeta>> = {
    // 🌍 AFRICA
    TZ: {
        code: "TZ",
        name: "Tanzania",
        cluster: "AFRICA",
        slug: "tanzania",
        currency: "TZS",
        language: "en",
        seo_slug: "tanzania",
    },
    KE: {
        code: "KE",
        name: "Kenya",
        cluster: "AFRICA",
        slug: "kenya",
        currency: "KES",
        language: "en",
        seo_slug: "kenya",
    },
    UG: {
        code: "UG",
        name: "Uganda",
        cluster: "AFRICA",
        slug: "uganda",
        currency: "UGX",
        language: "en",
        seo_slug: "uganda",
    },
    NG: {
        code: "NG",
        name: "Nigeria",
        cluster: "AFRICA",
        slug: "nigeria",
        currency: "NGN",
        language: "en",
        seo_slug: "nigeria",
    },
    GH: {
        code: "GH",
        name: "Ghana",
        cluster: "AFRICA",
        slug: "ghana",
        currency: "GHS",
        language: "en",
        seo_slug: "ghana",
    },
    ET: {
        code: "ET",
        name: "Ethiopia",
        cluster: "AFRICA",
        slug: "ethiopia",
        currency: "ETB",
        language: "en",
        seo_slug: "ethiopia",
    },
    RW: {
        code: "RW",
        name: "Rwanda",
        cluster: "AFRICA",
        slug: "rwanda",
        currency: "RWF",
        language: "en",
        seo_slug: "rwanda",
    },
    ZM: {
        code: "ZM",
        name: "Zambia",
        cluster: "AFRICA",
        slug: "zambia",
        currency: "ZMW",
        language: "en",
        seo_slug: "zambia",
    },
    MW: {
        code: "MW",
        name: "Malawi",
        cluster: "AFRICA",
        slug: "malawi",
        currency: "MWK",
        language: "en",
        seo_slug: "malawi",
    },

    // 🇿🇦 SOUTH AFRICA
    ZA: {
        code: "ZA",
        name: "South Africa",
        cluster: "SOUTH_AFRICA",
        slug: "south-africa",
        currency: "ZAR",
        language: "en",
        seo_slug: "south-africa",
    },

    // 🌏 ASIA
    IN: {
        code: "IN",
        name: "India",
        cluster: "ASIA",
        slug: "india",
        currency: "INR",
        language: "en",
        seo_slug: "india",
    },
    PK: {
        code: "PK",
        name: "Pakistan",
        cluster: "ASIA",
        slug: "pakistan",
        currency: "PKR",
        language: "en",
        seo_slug: "pakistan",
    },
    BD: {
        code: "BD",
        name: "Bangladesh",
        cluster: "ASIA",
        slug: "bangladesh",
        currency: "BDT",
        language: "en",
        seo_slug: "bangladesh",
    },
    ID: {
        code: "ID",
        name: "Indonesia",
        cluster: "ASIA",
        slug: "indonesia",
        currency: "IDR",
        language: "en",
        seo_slug: "indonesia",
    },
    MY: {
        code: "MY",
        name: "Malaysia",
        cluster: "ASIA",
        slug: "malaysia",
        currency: "MYR",
        language: "en",
        seo_slug: "malaysia",
    },
    TH: {
        code: "TH",
        name: "Thailand",
        cluster: "ASIA",
        slug: "thailand",
        currency: "THB",
        language: "en",
        seo_slug: "thailand",
    },
    VN: {
        code: "VN",
        name: "Vietnam",
        cluster: "ASIA",
        slug: "vietnam",
        currency: "VND",
        language: "en",
        seo_slug: "vietnam",
    },
    PH: {
        code: "PH",
        name: "Philippines",
        cluster: "ASIA",
        slug: "philippines",
        currency: "PHP",
        language: "en",
        seo_slug: "philippines",
    },

    // 🕌 MIDDLE EAST
    AE: {
        code: "AE",
        name: "United Arab Emirates",
        cluster: "MIDDLE_EAST",
        slug: "uae",
        currency: "AED",
        language: "ar",
        seo_slug: "uae",
    },
    SA: {
        code: "SA",
        name: "Saudi Arabia",
        cluster: "MIDDLE_EAST",
        slug: "saudi-arabia",
        currency: "SAR",
        language: "ar",
        seo_slug: "saudi-arabia",
    },
    QA: {
        code: "QA",
        name: "Qatar",
        cluster: "MIDDLE_EAST",
        slug: "qatar",
        currency: "QAR",
        language: "ar",
        seo_slug: "qatar",
    },
    KW: {
        code: "KW",
        name: "Kuwait",
        cluster: "MIDDLE_EAST",
        slug: "kuwait",
        currency: "KWD",
        language: "ar",
        seo_slug: "kuwait",
    },
    OM: {
        code: "OM",
        name: "Oman",
        cluster: "MIDDLE_EAST",
        slug: "oman",
        currency: "OMR",
        language: "ar",
        seo_slug: "oman",
    },
    BH: {
        code: "BH",
        name: "Bahrain",
        cluster: "MIDDLE_EAST",
        slug: "bahrain",
        currency: "BHD",
        language: "ar",
        seo_slug: "bahrain",
    },

    // 🇪🇺 EUROPE
    DE: {
        code: "DE",
        name: "Germany",
        cluster: "EUROPE",
        slug: "germany",
        currency: "EUR",
        language: "de",
        seo_slug: "germany",
    },
    FR: {
        code: "FR",
        name: "France",
        cluster: "EUROPE",
        slug: "france",
        currency: "EUR",
        language: "fr",
        seo_slug: "france",
    },
    ES: {
        code: "ES",
        name: "Spain",
        cluster: "EUROPE",
        slug: "spain",
        currency: "EUR",
        language: "es",
        seo_slug: "spain",
    },
    IT: {
        code: "IT",
        name: "Italy",
        cluster: "EUROPE",
        slug: "italy",
        currency: "EUR",
        language: "it",
        seo_slug: "italy",
    },
    NL: {
        code: "NL",
        name: "Netherlands",
        cluster: "EUROPE",
        slug: "netherlands",
        currency: "EUR",
        language: "nl",
        seo_slug: "netherlands",
    },
    BE: {
        code: "BE",
        name: "Belgium",
        cluster: "EUROPE",
        slug: "belgium",
        currency: "EUR",
        language: "fr",
        seo_slug: "belgium",
    },
    SE: {
        code: "SE",
        name: "Sweden",
        cluster: "EUROPE",
        slug: "sweden",
        currency: "SEK",
        language: "sv",
        seo_slug: "sweden",
    },
    NO: {
        code: "NO",
        name: "Norway",
        cluster: "EUROPE",
        slug: "norway",
        currency: "NOK",
        language: "no",
        seo_slug: "norway",
    },
    FI: {
        code: "FI",
        name: "Finland",
        cluster: "EUROPE",
        slug: "finland",
        currency: "EUR",
        language: "fi",
        seo_slug: "finland",
    },
    DK: {
        code: "DK",
        name: "Denmark",
        cluster: "EUROPE",
        slug: "denmark",
        currency: "DKK",
        language: "da",
        seo_slug: "denmark",
    },
    PL: {
        code: "PL",
        name: "Poland",
        cluster: "EUROPE",
        slug: "poland",
        currency: "PLN",
        language: "pl",
        seo_slug: "poland",
    },
    PT: {
        code: "PT",
        name: "Portugal",
        cluster: "EUROPE",
        slug: "portugal",
        currency: "EUR",
        language: "pt",
        seo_slug: "portugal",
    },
    GR: {
        code: "GR",
        name: "Greece",
        cluster: "EUROPE",
        slug: "greece",
        currency: "EUR",
        language: "el",
        seo_slug: "greece",
    },

    // 🇦🇺 AU / CA
    AU: {
        code: "AU",
        name: "Australia",
        cluster: "AU_CA",
        slug: "australia",
        currency: "AUD",
        language: "en",
        seo_slug: "australia",
    },
    NZ: {
        code: "NZ",
        name: "New Zealand",
        cluster: "AU_CA",
        slug: "new-zealand",
        currency: "NZD",
        language: "en",
        seo_slug: "new-zealand",
    },
    CA: {
        code: "CA",
        name: "Canada",
        cluster: "AU_CA",
        slug: "canada",
        currency: "CAD",
        language: "en",
        seo_slug: "canada",
    },
};

/* ================= HELPERS ================= */

export function normalizeCountryCode(code?: string | null): CountryCode | null {
    if (!code) return null;

    const upper = code.toUpperCase().trim();
    return (upper in COUNTRY_TO_CLUSTER ? upper : null) as CountryCode | null;
}

export function getClusterByCountry(code?: string | null): Cluster {
    const normalized = normalizeCountryCode(code);
    if (!normalized) return "GLOBAL";
    return COUNTRY_TO_CLUSTER[normalized] || "GLOBAL";
}

export function getCountryMeta(code?: string | null): CountryMeta | null {
    const normalized = normalizeCountryCode(code);
    if (!normalized) return null;
    return COUNTRY_META[normalized] || null;
}

export function getRegionLabel(code?: string | null): string {
    const meta = getCountryMeta(code);
    return meta?.name || "your region";
}
