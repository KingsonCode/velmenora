import {
    Broker,
    Intent,
    CountryCode,
    Feature,
    PaymentMethod,
} from "./types/broker";

/* ================= CONFIG (TUNABLE WEIGHTS) ================= */

const WEIGHTS = {
    rating: 2,
    priority: 1.5,

    feature: {
        LOW_SPREAD: 2,
        FAST_WITHDRAWAL: 2,
        HIGH_LEVERAGE: 1,
    },

    conversion: {
        trust: 3,
        speed: 2,
    },

    intentMatch: 3,
    geoMatch: 2,
    paymentMatch: 2,

    penalty: {
        noGeo: -3,
        lowTrust: -2,
    },
};

/* ================= SCORE RESULT ================= */

export type ScoreBreakdown = {
    total: number;
    details: Record<string, number>;
};

/* ================= CORE ENGINE ================= */

export function scoreBroker(
    b: Broker,
    context?: {
        country?: CountryCode;
        intent?: Intent;
        feature?: Feature;
        payment?: PaymentMethod;
    }
): number {
    return scoreBrokerDetailed(b, context).total;
}

/* ================= DETAILED (DEBUG + AI READY) ================= */

export function scoreBrokerDetailed(
    b: Broker,
    context?: {
        country?: CountryCode;
        intent?: Intent;
        feature?: Feature;
        payment?: PaymentMethod;
    }
): ScoreBreakdown {
    let total = 0;
    const details: Record<string, number> = {};

    /* ================= BASE ================= */
    const ratingScore = b.rating * WEIGHTS.rating;
    const priorityScore = (b.priority || 0) * WEIGHTS.priority;

    total += ratingScore + priorityScore;

    details.rating = ratingScore;
    details.priority = priorityScore;

    /* ================= FEATURES ================= */
    for (const f of b.features) {
        const w = WEIGHTS.feature[f as keyof typeof WEIGHTS.feature];
        if (w) {
            total += w;
            details[`feature:${f}`] = w;
        }
    }

    /* ================= CONVERSION ================= */
    if ((b.conversion?.trustLevel || 0) >= 8) {
        total += WEIGHTS.conversion.trust;
        details.trust = WEIGHTS.conversion.trust;
    }

    /* ================= INTENT ================= */
    if (context?.intent) {
        if (b.intent?.includes(context.intent)) {
            total += WEIGHTS.intentMatch;
            details.intent = WEIGHTS.intentMatch;
        }
    }

    /* ================= GEO ================= */
    if (context?.country) {
        const geoMatch =
            b.countries?.includes(context.country) ||
            b.countries?.includes("GLOBAL");

        if (geoMatch) {
            total += WEIGHTS.geoMatch;
            details.geo = WEIGHTS.geoMatch;
        } else {
            total += WEIGHTS.penalty.noGeo;
            details.geoPenalty = WEIGHTS.penalty.noGeo;
        }
    }

    /* ================= PAYMENT ================= */
    if (context?.payment) {
        if (b.payments.includes(context.payment)) {
            total += WEIGHTS.paymentMatch;
            details.payment = WEIGHTS.paymentMatch;
        }
    }

    /* ================= FEATURE TARGETING ================= */
    if (context?.feature) {
        if (b.features.includes(context.feature)) {
            total += 2;
            details.targetFeature = 2;
        }
    }

    /* ================= PENALTIES ================= */
    if ((b.conversion?.trustLevel || 0) > 0 && (b.conversion?.trustLevel || 0) <= 3) {
        total += WEIGHTS.penalty.lowTrust;
        details.lowTrustPenalty = WEIGHTS.penalty.lowTrust;
    }

    return {
        total,
        details,
    };
}
