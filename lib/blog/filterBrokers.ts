import { getAllBrokers } from "@/lib/brokers";
import { Broker, CountryCode } from "@/lib/types/broker";
import { BlogCategoryFilter } from "@/lib/blog/categories";

type Filter = BlogCategoryFilter & {
    country?: CountryCode;
    limit?: number;
    allowFallback?: boolean;
};

const AFRICA_COUNTRIES: CountryCode[] = ["TZ", "KE", "UG", "NG", "GH", "ZA"];
const MIDDLE_EAST_COUNTRIES: CountryCode[] = ["AE", "SA"];
const ASIA_COUNTRIES: CountryCode[] = ["IN", "PK", "BD", "ID", "MY", "TH", "VN", "PH"];

/* =========================================
   COUNTRY → REGION MATCH
========================================= */

function getCountryRegion(country?: CountryCode): string | null {
    if (!country) return null;

    if (AFRICA_COUNTRIES.includes(country)) return "AFRICA";
    if (MIDDLE_EAST_COUNTRIES.includes(country)) return "MIDDLE_EAST";
    if (ASIA_COUNTRIES.includes(country)) return "ASIA";

    return null;
}

function brokerSupportsCountry(broker: Broker, country?: CountryCode): boolean {
    if (!country) return true;

    if (broker.countries?.includes(country)) return true;
    if (broker.regions?.includes("GLOBAL")) return true;

    const region = getCountryRegion(country);
    if (region && broker.regions?.includes(region as never)) return true;

    return false;
}

/* =========================================
   MATCH HELPERS
========================================= */

function countFeatureMatches(broker: Broker, features?: Filter["features"]): number {
    if (!features?.length) return 0;

    return features.reduce((count, feature) => {
        return broker.features?.includes(feature as never) ? count + 1 : count;
    }, 0);
}

function hasIntentMatch(broker: Broker, intent?: Filter["intent"]): boolean {
    if (!intent) return false;
    return !!broker.intent?.includes(intent as never);
}

function hasExactFeatureMatch(broker: Broker, features?: Filter["features"]): boolean {
    if (!features?.length) return true;
    return features.every((feature) => broker.features?.includes(feature as never));
}

/* =========================================
   SCORING
========================================= */

function scoreBroker(broker: Broker, filter: Filter): number {
    let score = 0;

    /* base quality */
    score += broker.priority ?? 0;
    score += Math.round((broker.rating ?? 0) * 2);

    /* category relevance */
    const matchedFeatures = countFeatureMatches(broker, filter.features);
    score += matchedFeatures * 5;

    if (filter.features?.length) {
        const allMatched = matchedFeatures === filter.features.length;
        if (allMatched) score += 6;
    }

    if (hasIntentMatch(broker, filter.intent)) {
        score += 7;
    }

    /* geo relevance */
    if (filter.country) {
        if (broker.countries?.includes(filter.country)) {
            score += 10;
        } else {
            const region = getCountryRegion(filter.country);
            if (region && broker.regions?.includes(region as never)) {
                score += 4;
            } else if (broker.regions?.includes("GLOBAL")) {
                score += 2;
            }
        }
    }

    /* small bonuses */
    if (broker.badge) score += 1;
    if (broker.features?.length) score += 1;

    return score;
}

/* =========================================
   DEDUPE + SORT
========================================= */

function dedupeBrokers(brokers: Broker[]): Broker[] {
    const seen = new Set<string>();
    const result: Broker[] = [];

    for (const broker of brokers) {
        if (seen.has(broker.slug)) continue;
        seen.add(broker.slug);
        result.push(broker);
    }

    return result;
}

function rankBrokers(brokers: Broker[], filter: Filter): Broker[] {
    return [...brokers].sort((a, b) => scoreBroker(b, filter) - scoreBroker(a, filter));
}

/* =========================================
   MAIN FILTER
========================================= */

export function filterBrokers(filter: Filter): Broker[] {
    const {
        country,
        limit = 6,
        allowFallback = true,
        features,
        intent,
    } = filter;

    const allBrokers = dedupeBrokers(getAllBrokers());

    /* Stage 1: strict geo + strict category match */
    const strictMatches = allBrokers.filter((broker) => {
        if (!brokerSupportsCountry(broker, country)) return false;
        if (!hasExactFeatureMatch(broker, features)) return false;
        if (intent && !hasIntentMatch(broker, intent)) return false;
        return true;
    });

    if (strictMatches.length >= limit) {
        return rankBrokers(strictMatches, filter).slice(0, limit);
    }

    /* Stage 2: geo-safe + partial category relevance */
    const relaxedMatches = allBrokers.filter((broker) => {
        if (!brokerSupportsCountry(broker, country)) return false;

        const featureHits = countFeatureMatches(broker, features);
        const intentHit = hasIntentMatch(broker, intent);

        if (features?.length && intent) {
            return featureHits > 0 || intentHit;
        }

        if (features?.length) {
            return featureHits > 0;
        }

        if (intent) {
            return intentHit;
        }

        return true;
    });

    const combined = dedupeBrokers([...strictMatches, ...relaxedMatches]);
    const rankedCombined = rankBrokers(combined, filter);

    if (rankedCombined.length >= 1) {
        return rankedCombined.slice(0, limit);
    }

    /* Stage 3: fallback to strongest country-supported brokers */
    if (allowFallback) {
        const countryFallback = allBrokers.filter((broker) =>
            brokerSupportsCountry(broker, country)
        );

        if (countryFallback.length) {
            return rankBrokers(countryFallback, filter).slice(0, limit);
        }

        /* Stage 4: ultimate fallback */
        return rankBrokers(allBrokers, filter).slice(0, limit);
    }

    return [];
}