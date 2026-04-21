type Broker = {
    name: string;
    features: string[];
    regions?: string[];
    countries?: string[];
    rating?: number;
};

type RankInput = {
    brokers: Broker[];
    intent: string;
    countryCode: string;
    cluster: string;
};

function scoreBroker(b: Broker, intent: string) {
    let score = b.rating ?? 0;

    if (intent === "low-spread" && b.features.includes("LOW_SPREAD")) score += 3;
    if (intent === "high-leverage" && b.features.includes("HIGH_LEVERAGE")) score += 3;
    if (intent === "beginner" && b.features.includes("BEGINNER_FRIENDLY")) score += 2;

    if (b.features.includes("FAST_EXECUTION")) score += 1;
    if (b.features.includes("INSTANT_WITHDRAWALS")) score += 2;

    return score;
}

export function rankBrokers(input: RankInput) {
    const filtered = input.brokers.filter(
        (b) =>
            b.countries?.includes(input.countryCode) ||
            b.regions?.includes(input.cluster) ||
            b.regions?.includes("GLOBAL")
    );

    return filtered
        .map((b) => ({
            ...b,
            _score: scoreBroker(b, input.intent),
        }))
        .sort((a, b) => b._score - a._score);
}