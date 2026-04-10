/* ================= TYPES ================= */

export type BrokerCategory = "forex" | "crypto" | "gold";

export type BrokerConfig = {
    name: string;
    slug: string;
    url: string;
    active: boolean;

    /* 🔥 UI + CONVERSION */
    rating: number;
    badge?: string;
    features: string[];

    /* 🔥 TARGETING */
    categories: BrokerCategory[];
    priority: number;

    /* 🔥 GEO */
    preferredCountries?: string[];
};

/* ================= DATABASE ================= */

export const brokers: Record<string, BrokerConfig> = {
    exness: {
        name: "Exness",
        slug: "exness",
        url: "https://one.exnessonelink.com/a/tmodpmod",
        active: true,

        rating: 4.9,
        badge: "Best Overall",
        features: ["Ultra-low spreads", "Instant withdrawals", "MT4/MT5"],

        categories: ["forex", "gold"],
        priority: 10,
        preferredCountries: ["TZ", "KE", "UG"],
    },

    xm: {
        name: "XM",
        slug: "xm",
        url: "https://affs.click/eJwMj",
        active: true,

        rating: 4.6,
        features: ["Bonuses", "Beginner friendly", "MT4/MT5"],

        categories: ["forex"],
        priority: 7,
    },

    pepperstone: {
        name: "Pepperstone",
        slug: "pepperstone",
        url: "https://pepperstone.com/global/go/refer-a-friend/?locale=en&promo_type=RAF&utm_source=3344410",
        active: true,

        rating: 4.8,
        badge: "Low Spreads",
        features: ["Razor account", "Fast execution", "No dealing desk"],

        categories: ["forex"],
        priority: 9,
    },

    tickmill: {
        name: "Tickmill",
        slug: "tickmill",
        url: "https://my.tickmill.com/?utm_campaign=ib_link&utm_content=IB75242421&utm_medium=ibdashboardrlw&utm_source=link",
        active: true,

        rating: 4.7,
        features: ["Low commission", "Fast execution", "Reliable platform"],

        categories: ["forex"],
        priority: 8,
    },

    roboforex: {
        name: "RoboForex",
        slug: "roboforex",
        url: "https://my.roboforex.com/?a=couzb",
        active: true,

        rating: 4.6,
        features: ["Bonuses", "Cent accounts", "Flexible leverage"],

        categories: ["forex", "crypto"],
        priority: 7,
    },

    avatrade: {
        name: "AvaTrade",
        slug: "avatrade",
        url: "https://www.avatrade.com/trading-account/?p=Webtrader&tag=220422",
        active: true,

        rating: 4.6,
        features: ["Copy trading", "Fixed spreads", "Beginner friendly"],

        categories: ["forex", "crypto"],
        priority: 6,
    },

    axi: {
        name: "Axi",
        slug: "axi",
        url: "https://records.axiaffiliates.com/visit/?bta=42694&brand=axitrader",
        active: true,

        rating: 4.6,
        features: ["Low latency", "Institutional grade", "MT4"],

        categories: ["forex"],
        priority: 6,
    },

    fxpro: {
        name: "FXPro",
        slug: "fxpro",
        url: "https://www.fxpro.com/?ib=2oWicYtJK",
        active: true,

        rating: 4.7,
        features: ["cTrader", "No requotes", "Deep liquidity"],

        categories: ["forex"],
        priority: 7,
    },
};

/* ================= HELPERS ================= */

/* 🔥 GET BY CATEGORY */
export function getBrokersByCategory(category: BrokerCategory) {
    return Object.values(brokers)
        .filter((b) => b.active && b.categories.includes(category))
        .sort((a, b) => b.priority - a.priority);
}

/* 🔥 SMART GEO SORT */
export function getTopBrokers(
    category: BrokerCategory,
    country?: string
) {
    let list = getBrokersByCategory(category);

    if (country) {
        list = list.sort((a, b) => {
            const aScore = a.preferredCountries?.includes(country) ? 1 : 0;
            const bScore = b.preferredCountries?.includes(country) ? 1 : 0;

            return bScore - aScore || b.priority - a.priority;
        });
    }

    return list;
}