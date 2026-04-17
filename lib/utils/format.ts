/* ================= FEATURE LABEL MAP ================= */

const FEATURE_LABELS = {
    LOW_SPREAD: "Low spreads",
    FAST_EXECUTION: "Fast execution",
    INSTANT_WITHDRAWALS: "Instant withdrawals",
    MT4: "MT4",
    MT5: "MT5",
    BONUSES: "Bonuses",
    BEGINNER_FRIENDLY: "Beginner friendly",
    RAW_SPREAD: "Raw spreads",
    RAZOR_ACCOUNT: "Razor account",
} as const;

type FeatureKey = keyof typeof FEATURE_LABELS;

/* ================= MAIN FORMATTER ================= */

export function formatFeature(feature: string): string {
    if (!feature || typeof feature !== "string") return "";

    const key = feature.trim().toUpperCase() as FeatureKey;

    // 🔥 Known mapping
    if (FEATURE_LABELS[key]) {
        return FEATURE_LABELS[key];
    }

    // 🔥 Smart fallback
    return humanize(feature);
}

/* ================= BULK FORMATTER ================= */

export function formatFeatures(features: string[] = []): string[] {
    return features
        .filter(Boolean)
        .map(formatFeature);
}

/* ================= HUMANIZER ================= */

function humanize(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}