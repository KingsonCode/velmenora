import { Broker } from "@/data/brokers";
import { scoreBroker } from "./recommendBroker";

/* ================= TYPES ================= */
export type Badge =
    | "Best Overall"
    | "Low Deposit"
    | "High Leverage"
    | "Beginner Friendly"
    | "Top Rated";

/* ================= CONFIG ================= */
const MAX_BADGES = 2;

const BADGE_PRIORITY: Badge[] = [
    "Best Overall",
    "Top Rated",
    "Low Deposit",
    "High Leverage",
    "Beginner Friendly",
];

/* ================= HELPERS ================= */
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

/* ================= PRE-COMPUTE (IMPORTANT) ================= */
/**
 * Compute once → reuse everywhere
 */
export function getTopBrokerId(all: Broker[]): string | null {
    if (!all.length) return null;

    return [...all]
        .sort((a, b) => scoreBroker(b) - scoreBroker(a))[0]?.id || null;
}

/* ================= MAIN ================= */
export function getBrokerBadges(
    broker: Broker,
    all: Broker[],
    topBrokerId?: string | null
): Badge[] {
    const badges: Badge[] = [];

    const deposit = parseDeposit(broker.minDeposit);
    const leverage = parseLeverage(broker.leverage);

    /* 🥇 BEST OVERALL */
    const topId = topBrokerId ?? getTopBrokerId(all);
    if (topId && broker.id === topId) {
        badges.push("Best Overall");
    }

    /* ⭐ TOP RATED */
    if (broker.rating >= 4.7) {
        badges.push("Top Rated");
    }

    /* 💰 LOW DEPOSIT */
    if (deposit <= 10) {
        badges.push("Low Deposit");
    }

    /* ⚡ HIGH LEVERAGE */
    if (leverage >= 1000) {
        badges.push("High Leverage");
    }

    /* 🧠 BEGINNER */
    if (broker.description?.toLowerCase().includes("beginner")) {
        badges.push("Beginner Friendly");
    }

    /* ================= PRIORITY SORT ================= */
    const sorted = badges.sort(
        (a, b) =>
            BADGE_PRIORITY.indexOf(a) - BADGE_PRIORITY.indexOf(b)
    );

    /* ================= LIMIT ================= */
    return sorted.slice(0, MAX_BADGES);
}