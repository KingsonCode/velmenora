/* ================= GEO ================= */

export type CountryCode =
    | "TZ"
    | "KE"
    | "NG"
    | "ZA"
    | "UG"
    | "GH"
    | "GLOBAL";

export type Region =
    | "AFRICA"
    | "EU"
    | "MIDDLE_EAST"
    | "GLOBAL";

/* ================= PLATFORM ================= */

export type Platform = "MT4" | "MT5" | "CTRADER";

/* ================= FEATURES ================= */

export type Feature =
    | "LOW_SPREAD"
    | "FAST_EXECUTION"
    | "INSTANT_WITHDRAWALS"
    | "BONUSES"
    | "BEGINNER_FRIENDLY"
    | "RAW_SPREAD"
    | "RAZOR_ACCOUNT"
    | "COPY_TRADING";

/* ================= PAYMENTS ================= */

export type PaymentMethod =
    | "MPESA"
    | "TIGO_PESA"
    | "AIRTEL_MONEY"
    | "BANK"
    | "CARD"
    | "CRYPTO";

/* ================= SEO / INTENT ================= */

export type Intent =
    | "BEGINNER"
    | "ADVANCED"
    | "SCALPING"
    | "PASSIVE";

/* ================= CATEGORY ================= */

export type Category =
    | "FOREX"
    | "CFD"
    | "CRYPTO";

/* ================= AFFILIATE ================= */

export type AffiliateConfig = {
    default: string;
    geo?: Partial<Record<CountryCode, string>>;
};

/* ================= CONVERSION ================= */

export type ConversionMeta = {
    bestFor?: string[];
    trustLevel?: number;
};

/* ================= BROKER ================= */

export type Broker = {
    /* ===== CORE ===== */
    name: string;
    slug: string;
    logo: string;

    /* ===== AFFILIATE (PRIMARY SOURCE) ===== */
    affiliate: AffiliateConfig;

    /* ===== BACKWARD COMPAT (OPTIONAL) ===== */
    url?: string; // fallback (legacy)
    alt_urls?: Record<string, string>;

    /* ===== META ===== */
    rating: number;
    active: boolean;
    priority?: number;

    minDeposit?: number;
    spreadsFrom?: number;

    /* ===== TRADING ===== */
    platforms?: Platform[];
    features: Feature[];
    payments: PaymentMethod[];

    /* ===== GEO ===== */
    countries?: CountryCode[];
    regions?: Region[];

    /* ===== SEO ===== */
    intent?: Intent[];
    category: Category[]; // 🔥 ARRAY (not single)

    tags?: string[];

    /* ===== CONVERSION ===== */
    conversion?: ConversionMeta;
};

/* ================= HELPERS ================= */

export type BrokerMap = Record<string, Broker>;
export type BrokerSlug = keyof BrokerMap;