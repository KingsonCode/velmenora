/* ================= FEATURE FORMATTER ================= */

export function formatFeature(feature: string): string {
    const map: Record<string, string> = {
        LOW_SPREAD: "Low spreads",
        FAST_EXECUTION: "Fast execution",
        INSTANT_WITHDRAWALS: "Instant withdrawals",
        MT4: "MT4",
        MT5: "MT5",
        BONUSES: "Bonuses",
        BEGINNER_FRIENDLY: "Beginner friendly",
        RAW_SPREAD: "Raw spreads",
        RAZOR_ACCOUNT: "Razor account",
    };

    return map[feature] ?? normalizeFallback(feature);
}

/* ================= FALLBACK NORMALIZER ================= */

function normalizeFallback(value: string): string {
    return value
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
}

/* ================= SAFE NORMALIZER (CRITICAL) ================= */

export function normalizeBroker(raw: any) {
    return {
        ...raw,

        // 🔥 enforce consistent naming
        bestFor: raw.bestFor ?? raw.best_for ?? [],
        trustLevel: raw.trustLevel ?? raw.trust_level ?? 0,
        category: raw.category ?? raw.categories ?? [],

        // optional cleanup
        features: raw.features ?? [],
    };
}