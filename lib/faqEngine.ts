import { Broker } from "./types/broker";
import { pick } from "@/lib/utils/pick";

/* ================= TYPES ================= */

type FAQItem = {
    q: string;
    a: string;
};

function formatPlatforms(broker: Broker): string {
    return broker.platforms?.length
        ? broker.platforms.join(", ")
        : "MT4 and MT5";
}

function formatMinDeposit(broker: Broker): string {
    return broker.minDeposit != null
        ? `$${broker.minDeposit}`
        : "a low amount";
}

function getLowerSpreadBroker(a: Broker, b: Broker): string {
    if (a.spreadsFrom == null && b.spreadsFrom == null) {
        return a.rating >= b.rating ? a.name : b.name;
    }

    if (a.spreadsFrom == null) return b.name;
    if (b.spreadsFrom == null) return a.name;

    return a.spreadsFrom <= b.spreadsFrom ? a.name : b.name;
}

function getBeginnerBroker(a: Broker, b: Broker): string {
    const aBeginner = a.intent?.includes("BEGINNER") ?? false;
    const bBeginner = b.intent?.includes("BEGINNER") ?? false;

    if (aBeginner && !bBeginner) return a.name;
    if (bBeginner && !aBeginner) return b.name;

    return a.rating >= b.rating ? a.name : b.name;
}

/* ================= REVIEW FAQ ================= */

export function buildReviewFAQs(broker: Broker): FAQItem[] {
    return [
        {
            q: `Is ${broker.name} a good broker?`,
            a: pick([
                `${broker.name} is considered ${broker.conversion?.trustLevel || "a reliable"
                } broker with features like ${broker.features.join(", ")}.`,
                `${broker.name} is widely used by traders due to its ${broker.features.join(
                    ", "
                )} and overall trading reliability.`,
            ] as const),
        },

        {
            q: `What is the minimum deposit for ${broker.name}?`,
            a: pick([
                `The minimum deposit for ${broker.name} starts from ${formatMinDeposit(broker)}.`,
                `${broker.name} allows traders to start with as little as ${formatMinDeposit(broker)}.`,
            ] as const),
        },

        {
            q: `Does ${broker.name} support fast withdrawals?`,
            a: pick([
                `Yes, ${broker.name} offers reliable withdrawals depending on the method used.`,
                `Withdrawals on ${broker.name} are generally efficient, especially for supported payment methods.`,
            ] as const),
        },

        {
            q: `Which platforms does ${broker.name} support?`,
            a: `${broker.name} supports platforms such as ${formatPlatforms(broker)}.`,
        },
    ];
}

/* ================= COMPARISON FAQ ================= */

export function buildComparisonFAQs(
    a: Broker,
    b: Broker
): FAQItem[] {
    return [
        {
            q: `${a.name} vs ${b.name}: which is better?`,
            a: pick([
                `${a.name} and ${b.name} both offer strong trading conditions, but one may perform better depending on spreads, execution, and withdrawals.`,
                `The better broker between ${a.name} and ${b.name} depends on your trading style and preferred features.`,
            ] as const),
        },

        {
            q: `Which broker has lower spreads?`,
            a: `${getLowerSpreadBroker(a, b)} generally offers lower spreads.`,
        },

        {
            q: `Which broker is better for beginners?`,
            a: `${getBeginnerBroker(a, b)} is more suitable for beginner traders.`,
        },

        {
            q: `Do both brokers support MT4 or MT5?`,
            a: `${a.name} supports ${formatPlatforms(a)}, while ${b.name} supports ${formatPlatforms(b)}.`,
        },
    ];
}
