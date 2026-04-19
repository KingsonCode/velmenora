import type { Broker, CountryCode, Feature, Intent } from "@/lib/types/broker";

/* =========================================
   INPUT
========================================= */

export type RankingInput = {
    brokers: Broker[];
    country?: CountryCode;
    features?: Feature[];
    intent?: Intent;
    limit?: number;
};

/* =========================================
   WEIGHTS (TUNABLE = POWER AREA)
========================================= */

const WEIGHTS = {
    priority: 5,
    rating: 4,

    featureMatch: 6,
    intentMatch: 5,

    countryMatch: 8,
    regionMatch: 4,

    conversionTrust: 3,
};

/* =========================================
   GEO HELPERS
========================================= */

function isCountryMatch(broker: Broker, country?: CountryCode): boolean {
    if (!country) return false;
    return broker.countries?.includes(country) ?? false;
}

function isRegionMatch(broker: Broker): boolean {
    return broker.regions?.includes("GLOBAL") ?? false;
}

/* =========================================
   FEATURE MATCH
========================================= */

function getFeatureScore(
    broker: Broker,
    features?: Feature[]
): number {
    if (!features || features.length === 0) return 0;

    let score = 0;

    for (const feature of features) {
        if (broker.features.includes(feature)) {
            score += WEIGHTS.featureMatch;
        }
    }

    return score;
}

/* =========================================
   INTENT MATCH
========================================= */

function getIntentScore(
    broker: Broker,
    intent?: Intent
): number {
    if (!intent) return 0;

    if (broker.intent?.includes(intent)) {
        return WEIGHTS.intentMatch;
    }

    return 0;
}

/* =========================================
   GEO SCORE
========================================= */

function getGeoScore(
    broker: Broker,
    country?: CountryCode
): number {
    let score = 0;

    if (isCountryMatch(broker, country)) {
        score += WEIGHTS.countryMatch;
    } else if (isRegionMatch(broker)) {
        score += WEIGHTS.regionMatch;
    }

    return score;
}

/* =========================================
   CONVERSION SCORE
========================================= */

function getConversionScore(broker: Broker): number {
    const trust = broker.conversion?.trustLevel ?? 0;
    return trust * WEIGHTS.conversionTrust;
}

/* =========================================
   BASE SCORE
========================================= */

function getBaseScore(broker: Broker): number {
    const priority = broker.priority ?? 0;
    const rating = broker.rating ?? 0;

    return (
        priority * WEIGHTS.priority +
        rating * WEIGHTS.rating
    );
}

/* =========================================
   FINAL SCORE
========================================= */

function scoreBroker(broker: Broker, input: RankingInput): number {
    return (
        getBaseScore(broker) +
        getFeatureScore(broker, input.features) +
        getIntentScore(broker, input.intent) +
        getGeoScore(broker, input.country) +
        getConversionScore(broker)
    );
}

/* =========================================
   MAIN ENGINE
========================================= */

export function rankBrokers(input: RankingInput): Broker[] {
    const { brokers, limit = 10 } = input;

    const scored = brokers
        .filter((b) => b.active)
        .map((broker) => ({
            broker,
            score: scoreBroker(broker, input),
        }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((s) => s.broker);
}