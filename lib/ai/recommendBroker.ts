/* ================= IMPORT ================= */
import type { Broker } from "@/lib/types/broker";

/* ================= TYPES ================= */
export type AIResult = {
    broker: Broker;
    score: number;
    reasons: string[];
    badges: string[];
};

/* ================= CONFIG ================= */
const WEIGHTS = {
    rating: 3,
    priority: 2,
    conversion: 3,
    geo: 2,
    features: 2,
};

/* ================= HELPERS ================= */

/* Normalize features into searchable string */
function featureText(b: Broker): string {
    return b.features.join(" ").toLowerCase();
}

/* ================= CORE SCORING ================= */
export function scoreBroker(b: Broker): number {
    let score = 0;

    /* ⭐ RATING */
    score += b.rating * WEIGHTS.rating;

    /* 🎯 PRIORITY (manual ranking control) */
    score += (b.priority || 0) * WEIGHTS.priority;

    /* 💰 CONVERSION (affiliate power) */
    score += (b.conversion?.trustLevel || 0) * WEIGHTS.conversion;

    /* 🌍 GEO (important for TZ/AFRICA) */
    if (b.regions?.includes("AFRICA")) score += 5;
    if (b.regions?.includes("GLOBAL")) score += 2;

    /* ⚡ FEATURES (semantic detection) */
    const f = featureText(b);

    if (f.includes("low spread") || f.includes("raw")) score += 3;
    if (f.includes("instant") || f.includes("fast")) score += 3;
    if (f.includes("beginner")) score += 2;

    return score;
}

/* ================= AI ENGINE ================= */
export function recommendBroker(brokers: Broker[]): AIResult | null {
    if (!brokers.length) return null;

    const scored: AIResult[] = brokers.map((b) => {
        let score = scoreBroker(b);
        const reasons: string[] = [];
        const badges: string[] = [];

        const f = featureText(b);

        /* ⭐ RATING */
        if (b.rating >= 4.7) {
            reasons.push("Top-rated by traders");
            badges.push("⭐ Top Rated");
        }

        /* 💰 LOW SPREADS */
        if (f.includes("low spread") || f.includes("raw")) {
            reasons.push("Ultra-low spreads");
            badges.push("💰 Low Spreads");
        }

        /* ⚡ FAST EXECUTION / WITHDRAW */
        if (f.includes("instant") || f.includes("fast")) {
            reasons.push("Fast execution & withdrawals");
            badges.push("⚡ Fast Withdrawals");
        }

        /* 🧠 BEGINNER */
        if (f.includes("beginner")) {
            reasons.push("Beginner friendly platform");
            badges.push("🧠 Beginner Friendly");
        }

        /* 🌍 REGION MATCH */
        if (b.regions?.includes("AFRICA")) {
            reasons.push("Available in your region");
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

    /* ================= SORT ================= */
    const best = scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;

        /* tie-breaker: rating */
        if (b.broker.rating !== a.broker.rating) {
            return b.broker.rating - a.broker.rating;
        }

        /* tie-breaker: priority */
        return (b.broker.priority || 0) - (a.broker.priority || 0);
    })[0];

    return best ?? null;
}
