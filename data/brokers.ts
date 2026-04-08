// data/brokers.ts

/* ================= TYPES ================= */
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

    countries?: string[];

    minDeposit?: string;
    leverage?: string;
    spreadsFrom?: string;

    seoTitle?: string;
    seoDescription?: string;

    active?: boolean;
};

/* ================= DATA ================= */
export const brokers: Broker[] = [
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
        link: "https://one.exnessonelink.com/a/tmodpmod",
        logo: "/brokers/exness.png",
        countries: ["tanzania", "kenya", "nigeria"],
        minDeposit: "$10",
        leverage: "1:2000",
        spreadsFrom: "0.0 pips",
        seoTitle: "Exness Review 2026 – Best Forex Broker in Tanzania",
        seoDescription:
            "Exness offers instant withdrawals, low spreads and MT4/MT5 trading.",
        active: true,
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
        link: "https://affs.click/eJwMj",
        logo: "/brokers/xm.png",
        countries: ["tanzania", "south-africa"],
        minDeposit: "$5",
        leverage: "1:888",
        spreadsFrom: "0.6 pips",
        seoTitle: "XM Broker Review – Bonuses & Low Deposit Trading",
        seoDescription:
            "XM offers free bonuses and low entry deposit.",
        active: true,
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
        link: "https://affs.click/eJwMj",
        logo: "/brokers/deriv.png",
        countries: ["tanzania", "ghana", "india"],
        minDeposit: "$5",
        leverage: "1:1000",
        spreadsFrom: "Variable",
        seoTitle: "Deriv Review – Best for Synthetic Indices",
        seoDescription:
            "Deriv is beginner-friendly with synthetic trading.",
        active: true,
    },
];