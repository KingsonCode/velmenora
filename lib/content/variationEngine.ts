/* =========================================================
   TYPES
========================================================= */

type Intent =
    | "best"
    | "low-spread"
    | "high-leverage"
    | "beginner"
    | "guide";

type CountryCtx = {
    country: string;
    countryName: string;
    cluster: string;
    payments: string[];
};

type BrokerLite = {
    name: string;
    features: string[];
    platforms?: string[];
};

type VariationInput = {
    intent: Intent;
    ctx: CountryCtx;
    brokers: BrokerLite[];
    seedKey: string;
};

/* =========================================================
   DETERMINISTIC HASH
========================================================= */

function hash(str: string): number {
    let h = 2166136261;

    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }

    return h >>> 0;
}

/* =========================================================
   SAFE PICK
========================================================= */

function pick<T>(arr: readonly T[], seed: number): T {
    if (arr.length === 0) {
        throw new Error("pick() received empty array");
    }

    const index = seed % arr.length;
    return arr[index]!;
}

/* =========================================================
   PHRASE BANKS
========================================================= */

const INTROS: Record<Intent, readonly string[]> = {
    best: [
        "Finding the best forex brokers in {countryName} requires evaluating spreads, execution speed, and local payment support.",
        "This guide ranks top forex brokers in {countryName} based on trading costs, reliability, and withdrawal speed.",
        "If you're trading in {countryName}, choosing a broker with strong regulation and fast withdrawals is critical.",
    ],
    "low-spread": [
        "Low spread brokers in {countryName} are essential for scalping and cost-efficient trading.",
        "Traders in {countryName} looking to reduce costs should prioritize brokers with tight spreads and fast execution.",
        "This page highlights brokers in {countryName} offering the lowest spreads for active traders.",
    ],
    "high-leverage": [
        "High leverage brokers in {countryName} allow traders to amplify positions with smaller capital.",
        "For traders in {countryName}, leverage can increase opportunity—but also risk—so broker choice matters.",
        "Here are the top brokers in {countryName} offering competitive leverage and risk controls.",
    ],
    beginner: [
        "Beginner-friendly brokers in {countryName} should offer simple platforms, education, and easy deposits.",
        "New traders in {countryName} benefit from brokers with intuitive apps and local payment methods.",
        "This guide lists brokers in {countryName} suitable for beginners starting their forex journey.",
    ],
    guide: [
        "Forex trading in {countryName} requires understanding platforms, costs, and payment methods.",
        "This guide explains how to start trading forex in {countryName} step by step.",
        "If you're new to forex in {countryName}, here’s what you need to know before choosing a broker.",
    ],
};

const CTAS: readonly string[] = [
    "Open an account in minutes and start trading today.",
    "Compare accounts and choose the broker that fits your strategy.",
    "Check spreads and withdrawal speed before you sign up.",
];

/* =========================================================
   MAIN BUILDER
========================================================= */

export function buildVariation(input: VariationInput) {
    const seed = hash(input.seedKey);

    const introTpl = pick(INTROS[input.intent], seed);
    const intro = introTpl.replaceAll(
        "{countryName}",
        input.ctx.countryName
    );

    const paymentsLine =
        input.ctx.payments.length > 0
            ? `Popular local methods include ${input.ctx.payments.join(", ")}.`
            : "";

    const brokerMentionsList = input.brokers
        .slice(0, 3)
        .map((b) => b.name);

    const brokerMentions =
        brokerMentionsList.length > 0
            ? `Top options include ${brokerMentionsList.join(", ")}.`
            : "";

    const cta = pick(CTAS, seed + 7);

    return {
        intro,
        paymentsLine,
        brokerMentions,
        cta,
    };
}