import { Broker } from "@/data/brokers";

/* ================= TYPES ================= */
export type AIResult = {
    broker: Broker;
    score: number;
    reasons: string[];
    badges: string[];
};

/* ================= CONFIG (TUNABLE) ================= */
const WEIGHTS = {
    rating: 3,
    lowDeposit: 2,
    highLeverage: 2,
    beginner: 1,
};

/* ================= SAFE HELPERS ================= */
function parseDeposit(val: any): number {
    if (typeof val === "number") return val;
    if (!val) return 0;
    return parseFloat(String(val).replace("$", "")) || 0;
}

function parseLeverage(val?: string): number {
    if (!val) return 0;
    const parts = val.split(":");
    return parseInt(parts[1] || "0") || 0;
}

/* =========================================================
   🔥 CORE SCORING FUNCTION (GLOBAL USE — VERY IMPORTANT)
========================================================= */
export function scoreBroker(b: Broker): number {
    let score = 0;

    const deposit = parseDeposit(b.minDeposit);
    const leverage = parseLeverage(b.leverage);

    if (b.rating >= 4.7) score += WEIGHTS.rating;
    if (deposit <= 10) score += WEIGHTS.lowDeposit;
    if (leverage >= 1000) score += WEIGHTS.highLeverage;
    if (b.description?.toLowerCase().includes("beginner"))
        score += WEIGHTS.beginner;

    return score;
}

/* ================= AI ENGINE ================= */
export function recommendBroker(brokers: Broker[]): AIResult | null {
    if (!brokers.length) return null;

    const scored: AIResult[] = brokers.map((b) => {
        let score = 0;
        const reasons: string[] = [];
        const badges: string[] = [];

        const deposit = parseDeposit(b.minDeposit);
        const leverage = parseLeverage(b.leverage);

        /* ⭐ RATING */
        if (b.rating >= 4.7) {
            score += WEIGHTS.rating;
            reasons.push("Top-rated by traders");
            badges.push("⭐ Top Rated");
        }

        /* 💰 LOW DEPOSIT */
        if (deposit <= 10) {
            score += WEIGHTS.lowDeposit;
            reasons.push("Low minimum deposit");
            badges.push("💰 Low Deposit");
        }

        /* ⚡ HIGH LEVERAGE */
        if (leverage >= 1000) {
            score += WEIGHTS.highLeverage;
            reasons.push("High leverage available");
            badges.push("⚡ High Leverage");
        }

        /* 🧠 BEGINNER FRIENDLY */
        if (b.description?.toLowerCase().includes("beginner")) {
            score += WEIGHTS.beginner;
            reasons.push("Beginner friendly platform");
            badges.push("🧠 Beginner Friendly");
        }

        /* 🔥 FALLBACK */
        if (reasons.length === 0) {
            reasons.push("Strong overall trading conditions");
        }

        return {
            broker: b,
            score,
            reasons,
            badges,
        };
    });

    /* ================= SMART SORT ================= */
    const best = scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;

        if (b.broker.rating !== a.broker.rating) {
            return b.broker.rating - a.broker.rating;
        }

        const depA = parseDeposit(a.broker.minDeposit);
        const depB = parseDeposit(b.broker.minDeposit);
        return depA - depB;
    })[0];

    return best ?? null;
}