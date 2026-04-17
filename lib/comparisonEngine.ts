import { getAllBrokers } from "./brokers";
import { getBroker } from "./brokerEngine";
import { scoreBroker } from "./rankingEngine";
import { CountryCode } from "./types/broker";

/* ================= TYPES ================= */

export type ComparisonResult = {
    a: string;
    b: string;
    winner: string;
    scores: {
        a: number;
        b: number;
    };
};

/* ================= NORMALIZE ================= */

export function normalizePair(a: string, b: string): [string, string] {
    return a < b ? [a, b] : [b, a];
}

/* ================= GENERATE PAIRS ================= */

export function generateComparisonPairs(): [string, string][] {
    const brokers = getAllBrokers();
    const pairs: [string, string][] = [];

    for (let i = 0; i < brokers.length; i++) {
        const a = brokers[i];
        if (!a) continue;

        for (let j = i + 1; j < brokers.length; j++) {
            const b = brokers[j];
            if (!b) continue;

            pairs.push(normalizePair(a.slug, b.slug));
        }
    }

    return pairs;
}

/* ================= PARSE SLUG ================= */

export function parseComparisonSlug(
    slug: string
): [string, string] | null {
    if (!slug.includes("-vs-")) return null;

    const parts = slug.split("-vs-");

    if (parts.length !== 2) return null;

    const [a, b] = parts;

    if (!a || !b) return null;

    return normalizePair(a, b);
}

/* ================= COMPARE ================= */

export function compareBrokers(
    aSlug: string,
    bSlug: string,
    context?: { country?: CountryCode }
): ComparisonResult {
    if (!aSlug || !bSlug) {
        throw new Error("Invalid comparison input");
    }

    const [aSafe, bSafe] = normalizePair(aSlug, bSlug);

    const a = getBroker(aSafe);
    const b = getBroker(bSafe);

    const scoreA = scoreBroker(a, context);
    const scoreB = scoreBroker(b, context);

    return {
        a: a.slug,
        b: b.slug,
        winner: scoreA >= scoreB ? a.slug : b.slug,
        scores: {
            a: scoreA,
            b: scoreB,
        },
    };
}