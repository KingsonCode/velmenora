// /lib/geo/clusters.ts

/**
 * Cluster definitions
 */
export type Cluster =
    | "AFRICA"
    | "SOUTH_AFRICA"
    | "ASIA"
    | "MIDDLE_EAST"
    | "EUROPE"
    | "AU_CA"
    | "US"
    | "GLOBAL";

export type Language = "en" | "fr" | "ar" | "de";

/**
 * Broker ranking structure (conversion control)
 */
export type BrokerPriority = {
    primary: string;
    secondary: string;
    tertiary: string;
};

/**
 * SEO + UX configuration per cluster
 */
export type ClusterConfig = {
    language: Language;
    currency: string;

    // UX + Conversion
    payment_methods: string[];
    broker_priority: BrokerPriority;
    pain_points: string[];

    // SEO Layer
    seo: {
        locale_slug: string;
        keyword_modifier: string;
        title_suffix: string;
    };

    // Dynamic Headlines
    headlines: {
        best_broker: string;
        fast_withdrawal: string;
        low_spread: string;
    };

    // Behavioral targeting
    behavior: {
        trust_level: "low" | "medium" | "high";
        prefers_mobile_money?: boolean;
        prefers_low_spread?: boolean;
        prefers_regulation?: boolean;
    };
};

/**
 * CLUSTER CONFIG ENGINE
 */
export const CLUSTERS: Record<Cluster, ClusterConfig> = {
    AFRICA: {
        language: "en",
        currency: "USD",

        payment_methods: ["M-Pesa", "Airtel Money", "Bank Transfer"],

        broker_priority: {
            primary: "exness",
            secondary: "xm",
            tertiary: "octa"
        },

        pain_points: [
            "slow withdrawals",
            "unregulated brokers",
            "high spreads"
        ],

        seo: {
            locale_slug: "africa",
            keyword_modifier: "Africa",
            title_suffix: "for African Traders"
        },

        headlines: {
            best_broker: "Best Forex Brokers in Africa (2026)",
            fast_withdrawal: "Fast Withdrawal Forex Brokers in Africa",
            low_spread: "Lowest Spread Brokers in Africa"
        },

        behavior: {
            trust_level: "low",
            prefers_mobile_money: true,
            prefers_low_spread: true
        }
    },

    SOUTH_AFRICA: {
        language: "en",
        currency: "ZAR",

        payment_methods: ["Bank Transfer", "Cards"],

        broker_priority: {
            primary: "ic_markets",
            secondary: "pepperstone",
            tertiary: "fxpro"
        },

        pain_points: [
            "regulation compliance",
            "execution speed",
            "broker reliability"
        ],

        seo: {
            locale_slug: "south-africa",
            keyword_modifier: "South Africa",
            title_suffix: "for South African Traders"
        },

        headlines: {
            best_broker: "Best Forex Brokers in South Africa",
            fast_withdrawal: "Fast Withdrawal Brokers in South Africa",
            low_spread: "Lowest Spread Brokers in South Africa"
        },

        behavior: {
            trust_level: "high",
            prefers_regulation: true,
            prefers_low_spread: true
        }
    },

    EUROPE: {
        language: "en",
        currency: "EUR",

        payment_methods: ["SEPA", "Skrill", "Neteller"],

        broker_priority: {
            primary: "ic_markets",
            secondary: "pepperstone",
            tertiary: "fxpro"
        },

        pain_points: [
            "strict regulation",
            "limited leverage",
            "verification delays"
        ],

        seo: {
            locale_slug: "europe",
            keyword_modifier: "Europe",
            title_suffix: "for European Traders"
        },

        headlines: {
            best_broker: "Best Forex Brokers in Europe (2026)",
            fast_withdrawal: "Fast Withdrawal Forex Brokers in Europe",
            low_spread: "Lowest Spread Brokers in Europe"
        },

        behavior: {
            trust_level: "high",
            prefers_regulation: true,
            prefers_low_spread: true
        }
    },

    MIDDLE_EAST: {
        language: "ar",
        currency: "USD",

        payment_methods: ["Bank Transfer", "Crypto"],

        broker_priority: {
            primary: "exness",
            secondary: "ava_trade",
            tertiary: "xm"
        },

        pain_points: [
            "halal compliance",
            "swap fees",
            "withdrawal restrictions"
        ],

        seo: {
            locale_slug: "middle-east",
            keyword_modifier: "Middle East",
            title_suffix: "for Middle Eastern Traders"
        },

        headlines: {
            best_broker: "أفضل شركات الفوركس في الشرق الأوسط",
            fast_withdrawal: "سحب سريع في الفوركس",
            low_spread: "أقل فروقات أسعار الفوركس"
        },

        behavior: {
            trust_level: "medium",
            prefers_regulation: true
        }
    },

    ASIA: {
        language: "en",
        currency: "USD",

        payment_methods: ["Bank Transfer", "Crypto", "E-wallets"],

        broker_priority: {
            primary: "exness",
            secondary: "xm",
            tertiary: "octa"
        },

        pain_points: [
            "bonus traps",
            "withdrawal delays",
            "slippage"
        ],

        seo: {
            locale_slug: "asia",
            keyword_modifier: "Asia",
            title_suffix: "for Asian Traders"
        },

        headlines: {
            best_broker: "Best Forex Brokers in Asia",
            fast_withdrawal: "Fast Withdrawal Brokers in Asia",
            low_spread: "Lowest Spread Brokers in Asia"
        },

        behavior: {
            trust_level: "medium",
            prefers_low_spread: true
        }
    },

    AU_CA: {
        language: "en",
        currency: "USD",

        payment_methods: ["Cards", "Bank Transfer"],

        broker_priority: {
            primary: "pepperstone",
            secondary: "ic_markets",
            tertiary: "fxpro"
        },

        pain_points: [
            "tax reporting",
            "regulation",
            "execution speed"
        ],

        seo: {
            locale_slug: "au-ca",
            keyword_modifier: "Australia & Canada",
            title_suffix: "for AU & CA Traders"
        },

        headlines: {
            best_broker: "Best Forex Brokers in Australia & Canada",
            fast_withdrawal: "Fast Withdrawal Brokers in AU & CA",
            low_spread: "Lowest Spread Brokers in AU & CA"
        },

        behavior: {
            trust_level: "high",
            prefers_regulation: true
        }
    },


    US: {
        language: "en",
        currency: "USD",

        payment_methods: ["Bank Transfer", "Cards", "Crypto"],

        broker_priority: {
            primary: "exness",
            secondary: "icmarkets",
            tertiary: "pepperstone"
        },

        pain_points: [
            "broker trust",
            "withdrawal reliability",
            "platform stability"
        ],

        seo: {
            locale_slug: "us",
            keyword_modifier: "United States",
            title_suffix: "for US-Based Traders"
        },

        headlines: {
            best_broker: "Best Forex Brokers for US-Based Traders",
            fast_withdrawal: "Fast Withdrawal Brokers for US-Based Traders",
            low_spread: "Lowest Spread Brokers for US-Based Traders"
        },

        behavior: {
            trust_level: "high",
            prefers_regulation: true,
            prefers_low_spread: true
        }
    },

    GLOBAL: {
        language: "en",
        currency: "USD",

        payment_methods: ["Crypto", "Cards"],

        broker_priority: {
            primary: "exness",
            secondary: "ic_markets",
            tertiary: "xm"
        },

        pain_points: [
            "trust issues",
            "fees",
            "platform stability"
        ],

        seo: {
            locale_slug: "global",
            keyword_modifier: "Global",
            title_suffix: "Worldwide"
        },

        headlines: {
            best_broker: "Best Forex Brokers Globally",
            fast_withdrawal: "Fast Withdrawal Forex Brokers",
            low_spread: "Lowest Spread Forex Brokers"
        },

        behavior: {
            trust_level: "medium"
        }
    }
};