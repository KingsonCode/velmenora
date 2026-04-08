/* ================= TYPES ================= */

/* 🔴 RAW TYPE (as-is kutoka source / marketing data) */
export type RawBroker = {
    id: string;
    name: string;
    slug: string;

    description: string;
    features: string[];

    rating: number;
    reviews?: number;

    badge?: string;
    logo?: string;

    link: string;

    countries?: string[];

    minDeposit?: string;   // 🔴 string (raw)
    leverage?: string;
    spreadsFrom?: string;

    seoTitle?: string;
    seoDescription?: string;

    active?: boolean;

    supportsTanzania?: boolean;
    priority?: "low" | "normal" | "high";
    platforms?: string[];

    conversionScore?: number;
    commissionWeight?: number;
};

/* 🟢 CLEAN TYPE (UI + LOGIC SAFE) */
export type Broker = {
    id: string;
    name: string;
    slug: string;

    description: string;
    features: string[];

    rating: number;
    reviews?: number;

    badge?: string;
    logo?: string;

    link: string;

    countries: string[];

    minDeposit: number;   // ✅ normalized
    leverage?: string;
    spreadsFrom?: string;

    seoTitle?: string;
    seoDescription?: string;

    active: boolean;

    supportsTanzania: boolean;
    priority: "low" | "normal" | "high";
    platforms: string[];  // ✅ always array

    conversionScore: number;
    commissionWeight: number;
};

/* ================= RAW DATA ================= */
const rawBrokers: RawBroker[] = [
    {
        id: "exness",
        name: "Exness",
        slug: "exness",
        description:
            "Ultra-fast withdrawals, tight spreads, and trusted by millions of traders worldwide.",
        features: [
            "Instant withdrawals",
            "Spreads from 0.0 pips",
            "MT4 & MT5 platforms",
            "Low minimum deposit ($10)",
        ],
        rating: 4.8,
        reviews: 1200000,
        badge: "Top Choice",
        logo: "/brokers/exness.png",
        link: "https://one.exnessonelink.com/a/tmodpmod",
        countries: ["tanzania", "kenya", "nigeria"],
        platforms: ["MT4", "MT5"],
        minDeposit: "$10",
        leverage: "1:2000",
        spreadsFrom: "0.0 pips",
        seoTitle: "Exness Review 2026 – Best Forex Broker in Tanzania",
        seoDescription:
            "Exness offers instant withdrawals, low spreads and MT4/MT5 trading.",
        active: true,
        supportsTanzania: true,
        priority: "high",
        conversionScore: 0.9,
        commissionWeight: 1.2,
    },

    {
        id: "xm",
        name: "XM",
        slug: "xm",
        description:
            "Beginner-friendly broker with bonuses and strong global reputation.",
        features: [
            "Deposit bonus",
            "Free education",
            "Low minimum deposit",
            "Negative balance protection",
        ],
        rating: 4.6,
        reviews: 950000,
        badge: "Best for Beginners",
        logo: "/brokers/xm.png",
        link: "https://affs.click/eJwMj",
        countries: ["tanzania", "south-africa"],
        platforms: ["MT4", "MT5"],
        minDeposit: "$5",
        leverage: "1:888",
        spreadsFrom: "0.6 pips",
        seoTitle: "XM Broker Review – Bonuses & Low Deposit Trading",
        seoDescription:
            "XM offers free bonuses and low entry deposit.",
        active: true,
        supportsTanzania: true,
        priority: "normal",
        conversionScore: 0.7,
        commissionWeight: 1.0,
    },

    {
        id: "deriv",
        name: "Deriv",
        slug: "deriv",
        description:
            "Flexible trading platform ideal for synthetic indices.",
        features: [
            "Synthetic indices",
            "Low entry barrier",
            "24/7 trading",
            "Custom trading bots",
        ],
        rating: 4.5,
        reviews: 800000,
        badge: "Best for Synthetic Trading",
        logo: "/brokers/deriv.png",
        link: "https://affs.click/eJwMj",
        countries: ["tanzania", "ghana", "india"],
        platforms: ["Deriv Trader"],
        minDeposit: "$5",
        leverage: "1:1000",
        spreadsFrom: "Variable",
        seoTitle: "Deriv Review – Best for Synthetic Indices",
        seoDescription:
            "Deriv is beginner-friendly with synthetic trading.",
        active: true,
        supportsTanzania: true,
        priority: "normal",
        conversionScore: 0.6,
        commissionWeight: 0.9,
    },
];

/* ================= NORMALIZER ================= */

function parseMoney(value?: string): number {
    if (!value) return 0;

    // "$10" → 10
    const num = value.replace(/[^0-9.]/g, "");
    return Number(num || 0);
}

/* ================= FINAL EXPORT ================= */

export const brokers: Broker[] = rawBrokers.map((b) => ({
    ...b,

    /* ✅ NORMALIZATION */
    minDeposit: parseMoney(b.minDeposit),
    platforms: b.platforms ?? [],
    countries: b.countries ?? [],

    active: b.active ?? true,
    supportsTanzania: b.supportsTanzania ?? false,
    priority: b.priority ?? "normal",

    conversionScore: b.conversionScore ?? 0,
    commissionWeight: b.commissionWeight ?? 1,
}));