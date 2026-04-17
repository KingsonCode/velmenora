/* ================= IMPORTS ================= */
import type { Broker } from "@/lib/types/broker";
import { scoreBroker } from "./recommendBroker";

/* ================= TYPES ================= */
export type Badge =
    | "Best Overall"
    | "Top Rated"
    | "Beginner Friendly"
    | "Low Spreads"
    | "Fast Withdrawals";

/* ================= CONFIG ================= */
const MAX_BADGES = 2;

const BADGE_PRIORITY: Badge[] = [
    "Best Overall",
    "Top Rated",
    "Low Spreads",
    "Fast Withdrawals",
    "Beginner Friendly",
];

/* ================= HELPERS ================= */

/* Detect keywords inside features */
function hasFeature(broker: Broker, keyword: string) {
    return broker.features.some((f) =>
        f.toLowerCase().includes(keyword.toLowerCase())
    );
}

/* ================= CORE ================= */

/**
 * 🔥 Get Top Broker (AI scoring)
 */
export function getTopBrokerId(all: Broker[]): string | null {
    if (!all.length) return null;

    return [...all]
        .sort((a, b) => scoreBroker(b) - scoreBroker(a))[0]?.slug || null;
}

/**
 * 🔥 Generate Smart Badges
 */
export function getBrokerBadges(
    broker: Broker,
    all: Broker[],
    topBrokerId?: string | null
): Badge[] {
    const badges: Badge[] = [];

    const topId = topBrokerId ?? getTopBrokerId(all);

    /* 🥇 BEST OVERALL */
    if (topId && broker.slug === topId) {
        badges.push("Best Overall");
    }

    /* ⭐ TOP RATED */
    if (broker.rating >= 4.7) {
        badges.push("Top Rated");
    }

    /* 💸 LOW SPREADS */
    if (hasFeature(broker, "low spread") || hasFeature(broker, "raw")) {
        badges.push("Low Spreads");
    }

    /* ⚡ FAST WITHDRAWALS */
    if (hasFeature(broker, "instant") || hasFeature(broker, "fast")) {
        badges.push("Fast Withdrawals");
    }

    /* 🧠 BEGINNER FRIENDLY */
    if (hasFeature(broker, "beginner")) {
        badges.push("Beginner Friendly");
    }

    /* ================= PRIORITY SORT ================= */
    const sorted = badges.sort(
        (a, b) =>
            BADGE_PRIORITY.indexOf(a) - BADGE_PRIORITY.indexOf(b)
    );

    return sorted.slice(0, MAX_BADGES);
}