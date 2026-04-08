export type Region = "africa" | "asia" | "europe" | "global";

export type Country = {
    code: string;
    name: string;
    slug: string;
    region: Region;
    tier: number;
    payments: string[];

    seoTitle?: string;
    seoDescription?: string;
};

export const countries: Country[] = [
    // 🔥 TIER 1 (TOP MARKETS)

    {
        code: "tz",
        name: "Tanzania",
        slug: "tanzania",
        region: "africa",
        tier: 1,
        payments: ["M-Pesa", "Tigo Pesa", "Airtel Money"],
        seoTitle: "Best Forex Brokers in Tanzania (2026)",
        seoDescription:
            "Trade forex in Tanzania with M-Pesa, fast withdrawals, and trusted brokers.",
    },

    {
        code: "ke",
        name: "Kenya",
        slug: "kenya",
        region: "africa",
        tier: 1,
        payments: ["M-Pesa", "Bank Transfer"],
        seoTitle: "How to Trade Forex in Kenya (Beginner Guide)",
        seoDescription:
            "Start forex trading in Kenya using M-Pesa and low capital.",
    },

    {
        code: "ng",
        name: "Nigeria",
        slug: "nigeria",
        region: "africa",
        tier: 1,
        payments: ["Crypto", "Bank Transfer"],
        seoTitle: "Best Forex Brokers in Nigeria (Crypto + Fast Withdrawals)",
        seoDescription:
            "Trade forex in Nigeria using crypto and secure brokers.",
    },

    {
        code: "za",
        name: "South Africa",
        slug: "south-africa",
        region: "africa",
        tier: 1,
        payments: ["Bank Transfer", "Card"],
        seoTitle: "Best Forex Brokers in South Africa (FSCA Regulated)",
        seoDescription:
            "Trade forex in South Africa with regulated brokers and fast withdrawals.",
    },

    {
        code: "gh",
        name: "Ghana",
        slug: "ghana",
        region: "africa",
        tier: 1,
        payments: ["MTN MoMo", "Bank Transfer"],
        seoTitle: "Best Forex Brokers in Ghana (Mobile Money Supported)",
        seoDescription:
            "Trade forex in Ghana using MTN MoMo and secure brokers.",
    },

    {
        code: "ug",
        name: "Uganda",
        slug: "uganda",
        region: "africa",
        tier: 1,
        payments: ["MTN MoMo", "Airtel Money"],
        seoTitle: "Best Forex Brokers in Uganda (Mobile Money Trading)",
        seoDescription:
            "Trade forex in Uganda using mobile money and fast withdrawals.",
    },

    {
        code: "zm",
        name: "Zambia",
        slug: "zambia",
        region: "africa",
        tier: 1,
        payments: ["Airtel Money", "Bank Transfer"],
        seoTitle: "Best Forex Brokers in Zambia (Fast Withdrawals)",
        seoDescription:
            "Start trading forex in Zambia with reliable brokers and secure payments.",
    },

    {
        code: "rw",
        name: "Rwanda",
        slug: "rwanda",
        region: "africa",
        tier: 1,
        payments: ["Mobile Money", "Bank Transfer"],
        seoTitle: "Best Forex Brokers in Rwanda (2026 Guide)",
        seoDescription:
            "Trade forex in Rwanda using trusted brokers and mobile payments.",
    },

    {
        code: "et",
        name: "Ethiopia",
        slug: "ethiopia",
        region: "africa",
        tier: 1,
        payments: ["Bank Transfer"],
        seoTitle: "Forex Trading in Ethiopia (What You Need to Know)",
        seoDescription:
            "Learn how forex trading works in Ethiopia and available broker options.",
    },

    {
        code: "eg",
        name: "Egypt",
        slug: "egypt",
        region: "africa",
        tier: 1,
        payments: ["Card", "Bank Transfer"],
        seoTitle: "Best Forex Brokers in Egypt (Low Spreads)",
        seoDescription:
            "Trade forex in Egypt using global brokers and secure payment methods.",
    },

    // 🔥 TIER 2 (GROWTH MARKETS)

    {
        code: "ma",
        name: "Morocco",
        slug: "morocco",
        region: "africa",
        tier: 2,
        payments: ["Card", "Bank Transfer"],
        seoTitle: "Forex Trading in Morocco (Beginner Guide)",
        seoDescription:
            "Start forex trading in Morocco using international brokers.",
    },

    {
        code: "dz",
        name: "Algeria",
        slug: "algeria",
        region: "africa",
        tier: 2,
        payments: ["Bank Transfer"],
        seoTitle: "Forex Trading in Algeria (2026 Guide)",
        seoDescription:
            "Learn how to trade forex in Algeria using global platforms.",
    },

    {
        code: "cm",
        name: "Cameroon",
        slug: "cameroon",
        region: "africa",
        tier: 2,
        payments: ["Mobile Money", "Bank Transfer"],
        seoTitle: "Best Forex Brokers in Cameroon",
        seoDescription:
            "Trade forex in Cameroon with mobile money and secure brokers.",
    },

    {
        code: "ci",
        name: "Ivory Coast",
        slug: "ivory-coast",
        region: "africa",
        tier: 2,
        payments: ["Mobile Money", "Bank Transfer"],
        seoTitle: "Forex Trading in Ivory Coast (Guide)",
        seoDescription:
            "Start trading forex in Ivory Coast using trusted brokers.",
    },

    {
        code: "sn",
        name: "Senegal",
        slug: "senegal",
        region: "africa",
        tier: 2,
        payments: ["Mobile Money", "Bank Transfer"],
        seoTitle: "Best Forex Brokers in Senegal",
        seoDescription:
            "Trade forex in Senegal using mobile payments and global brokers.",
    },

    {
        code: "ao",
        name: "Angola",
        slug: "angola",
        region: "africa",
        tier: 2,
        payments: ["Bank Transfer"],
        seoTitle: "Forex Trading in Angola (2026)",
        seoDescription:
            "Learn how to trade forex in Angola using secure platforms.",
    },

    {
        code: "mz",
        name: "Mozambique",
        slug: "mozambique",
        region: "africa",
        tier: 2,
        payments: ["Mobile Money", "Bank Transfer"],
        seoTitle: "Best Forex Brokers in Mozambique",
        seoDescription:
            "Trade forex in Mozambique using mobile money and trusted brokers.",
    },

    {
        code: "bw",
        name: "Botswana",
        slug: "botswana",
        region: "africa",
        tier: 2,
        payments: ["Bank Transfer", "Card"],
        seoTitle: "Forex Trading in Botswana (Guide)",
        seoDescription:
            "Start forex trading in Botswana with reliable brokers.",
    },

    {
        code: "na",
        name: "Namibia",
        slug: "namibia",
        region: "africa",
        tier: 2,
        payments: ["Bank Transfer", "Card"],
        seoTitle: "Best Forex Brokers in Namibia",
        seoDescription:
            "Trade forex in Namibia using global brokers and secure payments.",
    },

    {
        code: "zw",
        name: "Zimbabwe",
        slug: "zimbabwe",
        region: "africa",
        tier: 2,
        payments: ["Crypto", "Mobile Money"],
        seoTitle: "Forex Trading in Zimbabwe (Crypto Friendly)",
        seoDescription:
            "Trade forex in Zimbabwe using crypto and global brokers.",
    },
];


/* =========================================================
   🔥 FAST LOOKUPS (O(1) — SCALE READY)
========================================================= */

export const countryBySlug = new Map(
    countries.map((c) => [c.slug, c])
);

export const countryByCode = new Map(
    countries.map((c) => [c.code, c])
);


/* =========================================================
   🔥 HELPERS (CLEAN API LAYER)
========================================================= */

// ✅ GET BY SLUG (FOR /[country])
export const getCountryBySlug = (slug: string) =>
    countryBySlug.get(slug);

// ✅ GET BY CODE (FOR GEO DETECTION)
export const getCountryByCode = (code: string) =>
    countryByCode.get(code);


// ✅ FILTER BY REGION
export const getByRegion = (region: Region) =>
    countries.filter((c) => c.region === region);


// ✅ FILTER BY TIER (MARKETS PRIORITY)
export const getByTier = (tier: number) =>
    countries.filter((c) => c.tier === tier);


// ✅ FILTER BY PAYMENT (VERY POWERFUL FOR SEO)
export const getByPayment = (method: string) =>
    countries.filter((c) =>
        c.payments.some((p) =>
            p.toLowerCase().includes(method.toLowerCase())
        )
    );


/* =========================================================
   🔥 PRESETS (READY TO USE)
========================================================= */

// 🌍 AFRICA LIST
export const africaCountries = getByRegion("africa");

// 💰 TOP MARKETS ONLY
export const topMarkets = getByTier(1);


/* =========================================================
   🔥 PROGRAMMATIC SEO (CRITICAL)
========================================================= */

export const generateSEO = (country: Country) => ({
    title:
        country.seoTitle ||
        `Best Forex Brokers in ${country.name} (2026)`,

    description:
        country.seoDescription ||
        `Trade forex in ${country.name} with trusted brokers and fast withdrawals.`,
});