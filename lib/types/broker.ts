/* ================= GEO ================= */

/**
 * 🔥 Country codes used across GEO detection, routing, and broker targeting
 */
export type CountryCode =
    // AFRICA
    | "TZ"
    | "KE"
    | "NG"
    | "ZA"
    | "UG"
    | "GH"

    // MIDDLE EAST
    | "AE"
    | "SA"

    // ASIA
    | "IN"
    | "PK"
    | "BD"
    | "ID"
    | "MY"
    | "TH"
    | "VN"
    | "PH"

    // FALLBACK
    | "GLOBAL";

/**
 * 🔥 Region abstraction (used for fallback targeting)
 */
export type Region =
    | "AFRICA"
    | "EU"
    | "MIDDLE_EAST"
    | "ASIA"
    | "GLOBAL";

/* ================= PLATFORM ================= */

export type Platform = "MT4" | "MT5" | "CTRADER";

/* ================= FEATURES ================= */
/**
 * 🔥 SINGLE SOURCE OF TRUTH
 * Used by:
 * - category filters
 * - ranking engine
 * - UI badges/tags
 */
export type Feature =
    | "LOW_SPREAD"
    | "RAW_SPREAD"
    | "FAST_EXECUTION"
    | "INSTANT_WITHDRAWALS"
    | "HIGH_LEVERAGE"        // ✅ FIX
    | "BONUSES"
    | "BEGINNER_FRIENDLY"
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

/**
 * 🔥 Future ranking signals
 * Used by rankingEngine + optimization layer
 */
export type ConversionMeta = {
    bestFor?: string[];
    trustLevel?: number;
    speedScore?: number;   // withdrawals / execution
    costScore?: number;    // spreads / fees abstraction
};

/* ================= BROKER ================= */

/**
 * 🔥 CORE ENTITY
 * This powers:
 * - blog pages
 * - compare pages
 * - ranking engine
 * - affiliate routing
 */
export type Broker = {
    /* ===== CORE ===== */
    name: string;
    slug: string;
    logo: string;

    /* ===== AFFILIATE ===== */
    affiliate: AffiliateConfig;

    /* ===== BACKWARD COMPAT ===== */
    url?: string;
    alt_urls?: Record<string, string>;

    /* ===== META ===== */
    rating: number;
    active: boolean;
    priority?: number;

    minDeposit?: number;
    spreadsFrom?: number;

    /* ===== UX / MARKETING ===== */
    badge?: string; // 🔥 NEW (UI + conversion hint)

    /* ===== TRADING ===== */
    platforms?: Platform[];
    features: Feature[];
    payments: PaymentMethod[];

    /* ===== GEO ===== */
    countries?: CountryCode[];
    regions?: Region[];

    /* ===== MATCHING ===== */
    intent?: Intent[];
    category: Category[];

    tags?: string[];

    /* ===== CONVERSION ===== */
    conversion?: ConversionMeta;
};

/* ================= HELPERS ================= */

export type BrokerMap = Record<string, Broker>;
export type BrokerSlug = keyof BrokerMap;