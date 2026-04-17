/* ================= TYPES ================= */

export type BrokerRaw = Record<string, any>;

export type BrokerNormalized = {
    slug?: string;
    name?: string;

    bestFor: string[];
    trustLevel: number;
    category: string[];

    features: string[];

    // allow extension without breaking
    [key: string]: any;
};

/* ================= NORMALIZER ================= */

export function normalizeBroker(raw: BrokerRaw): BrokerNormalized {
    if (!raw || typeof raw !== "object") {
        return getEmptyBroker();
    }

    return {
        ...raw,

        // 🔥 enforce canonical naming
        bestFor: normalizeArray(raw.bestFor ?? raw.best_for),
        trustLevel: normalizeNumber(raw.trustLevel ?? raw.trust_level),
        category: normalizeArray(raw.category ?? raw.categories),

        features: normalizeArray(raw.features),
    };
}

/* ================= HELPERS ================= */

function normalizeArray(value: any): string[] {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value.filter(Boolean).map(String);
    }

    // handle single string
    return [String(value)];
}

function normalizeNumber(value: any): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
}

/* ================= SAFE DEFAULT ================= */

function getEmptyBroker(): BrokerNormalized {
    return {
        bestFor: [],
        trustLevel: 0,
        category: [],
        features: [],
    };
}