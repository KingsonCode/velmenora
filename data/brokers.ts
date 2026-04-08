import { Broker } from "@/components/BrokerCard";

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

        // ✅ REAL AFFILIATE LINK
        link: "https://one.exnessonelink.com/a/tmodpmod",

        logo: "/brokers/exness.png",

        countries: ["tanzania", "kenya", "nigeria"],

        minDeposit: "$10",
        leverage: "1:2000",
        spreadsFrom: "0.0 pips",

        seoTitle: "Exness Review 2026 – Best Forex Broker in Tanzania",
        seoDescription:
            "Exness offers instant withdrawals, low spreads and MT4/MT5 trading. Read full review before opening account.",
    },

    {
        id: "xm",
        name: "XM",
        slug: "xm",

        description:
            "Beginner-friendly broker with bonuses, education tools, and strong global reputation.",

        features: [
            "Deposit bonus",
            "Free education",
            "Low minimum deposit",
            "Negative balance protection",
        ],

        rating: 4.6,
        reviews: 950000,

        badge: "Best for Beginners",

        // ✅ REAL AFFILIATE LINK
        link: "https://affs.click/eJwMj",

        logo: "/brokers/xm.png",

        countries: ["tanzania", "south-africa"],

        minDeposit: "$5",
        leverage: "1:888",
        spreadsFrom: "0.6 pips",

        seoTitle: "XM Broker Review – Bonuses & Low Deposit Trading",
        seoDescription:
            "XM offers free bonuses, MT4/MT5 trading and low entry deposit. Ideal for beginners.",
    },

    {
        id: "deriv",
        name: "Deriv",
        slug: "deriv",

        description:
            "Flexible trading platform ideal for synthetic indices and beginner traders.",

        features: [
            "Synthetic indices",
            "Low entry barrier",
            "24/7 trading",
            "Custom trading bots",
        ],

        rating: 4.5,
        reviews: 800000,

        badge: "Best for Synthetic Trading",

        // ⚠️ BADILISHA HII UKIPATA LINK HALISI
        link: "https://affs.click/eJwMj",

        logo: "/brokers/deriv.png",

        countries: ["tanzania", "ghana", "india"],

        minDeposit: "$5",
        leverage: "1:1000",
        spreadsFrom: "Variable",

        seoTitle: "Deriv Review – Best for Synthetic Indices Trading",
        seoDescription:
            "Deriv is a beginner-friendly broker with synthetic indices and low deposit requirements.",
    },
];