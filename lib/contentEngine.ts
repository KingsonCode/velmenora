import { pick } from "@/lib/utils/pick";
import type { Broker } from "./types/broker";

/* ================= UTILS ================= */

function formatFeature(f: string) {
    return f.toLowerCase().replace(/_/g, " ");
}

function paragraph(...sentences: string[]) {
    return sentences.join(" ");
}

function formatPlatforms(broker: Broker): string {
    return broker.platforms?.length
        ? broker.platforms.join(", ")
        : "multiple platforms";
}

function formatIntent(broker: Broker): string {
    return broker.intent?.length
        ? broker.intent.join(", ").toLowerCase()
        : "different types of";
}

function formatMinDeposit(broker: Broker): string {
    return broker.minDeposit != null
        ? `$${broker.minDeposit}`
        : "a low minimum deposit";
}

function formatSpreadsFrom(broker: Broker): string {
    return broker.spreadsFrom != null
        ? `${broker.spreadsFrom}`
        : "competitive levels";
}

function formatBestFor(broker: Broker): string {
    const bestFor = broker.conversion?.bestFor;

    if (Array.isArray(bestFor) && bestFor.length > 0) {
        return bestFor.join(", ");
    }

    return "stable trading conditions";
}

/* ================= REVIEW ENGINE ================= */

export function buildReviewSections(broker: Broker) {
    const features = broker.features.map(formatFeature).join(", ");

    const intro = pick([
        paragraph(
            `${broker.name} is one of the most recognized forex brokers in the market today.`,
            `It is known for offering ${features}, making it attractive for both beginners and experienced traders.`,
            `In this review, we explore its trading conditions, platforms, and overall reliability.`
        ),
        paragraph(
            `${broker.name} has gained popularity among traders due to its ${features}.`,
            `This review covers everything including spreads, deposits, withdrawals, and user experience.`
        ),
    ]);

    const trading = paragraph(
        `${broker.name} provides competitive trading conditions including spreads starting from ${formatSpreadsFrom(broker)}.`,
        `With ${formatMinDeposit(broker)}, it remains accessible to many traders.`,
        `It supports ${formatPlatforms(broker)}, ensuring flexibility.`
    );

    const featureSection = paragraph(
        `${broker.name} stands out due to ${features}.`,
        `These features improve execution speed and trading efficiency.`,
        `It is especially suitable for ${formatIntent(broker)} traders.`
    );

    const payments = paragraph(
        `${broker.name} supports ${broker.payments.join(", ")} for deposits and withdrawals.`,
        `This ensures flexibility and accessibility across different regions.`,
        `Withdrawal speed is considered reliable for active traders.`
    );

    const trust = paragraph(
        `${broker.name} is positioned as a trusted broker,`,
        `which impacts its trust level.`,
        `Overall trust is considered ${broker.conversion?.trustLevel || "moderate"}.`
    );

    const pros = broker.features.map(
        (f) => `Strong ${formatFeature(f)}`
    );

    const conclusion = paragraph(
        `${broker.name} is best suited for traders looking for ${formatBestFor(broker)}.`,
        `It combines features, platform support, and flexible payments effectively.`
    );

    return {
        intro,
        trading,
        features: featureSection,
        payments,
        trust,
        pros,
        conclusion,
    };
}

/* ================= COMPARISON ENGINE ================= */

export function buildComparisonSections(
    a: Broker,
    b: Broker,
    winner: Broker
) {
    const intro = paragraph(
        `${a.name} vs ${b.name} is a common comparison among traders.`,
        `Both brokers offer competitive features but differ in spreads, platforms, and execution.`,
        `This comparison breaks down the key differences.`
    );

    const conditions = paragraph(
        `${a.name} offers spreads from ${formatSpreadsFrom(a)}, while ${b.name} starts from ${formatSpreadsFrom(b)}.`,
        `Minimum deposit is ${formatMinDeposit(a)} vs ${formatMinDeposit(b)}.`,
        `These differences affect trading strategies and accessibility.`
    );

    const platforms = paragraph(
        `${a.name} supports ${formatPlatforms(a)}, while ${b.name} supports ${formatPlatforms(b)}.`,
        `Platform availability impacts usability and execution speed.`
    );

    const features = paragraph(
        `${a.name} offers ${a.features.join(", ")}, while ${b.name} provides ${b.features.join(", ")}.`,
        `Feature differences can influence trading performance.`
    );

    const verdict = paragraph(
        `${winner.name} stands out as the better overall choice.`,
        `It offers stronger trading conditions and user experience.`,
        `However, the other broker may still suit specific needs.`
    );

    return {
        intro,
        conditions,
        platforms,
        features,
        verdict,
    };
}

/* ================= COUNTRY ENGINE ================= */

export function buildCountrySections(country: string) {
    const intro = paragraph(
        `Finding the best forex brokers in ${country} requires evaluating multiple factors.`,
        `These include payments, spreads, and platform availability.`,
        `Traders in ${country} prioritize fast withdrawals and reliability.`
    );

    const regulation = paragraph(
        `Regulation is critical when choosing a broker in ${country}.`,
        `It ensures safety of funds and transparency.`,
        `Traders should prioritize regulated brokers.`
    );

    const payments = paragraph(
        `Local payment methods are essential in ${country}.`,
        `Brokers supporting mobile money and bank transfers provide better experience.`,
        `Fast withdrawals are key for active traders.`
    );

    const conclusion = paragraph(
        `The best brokers in ${country} combine low spreads, fast withdrawals, and reliable platforms.`,
        `Choosing the right broker depends on your trading goals.`
    );

    return {
        intro,
        regulation,
        payments,
        conclusion,
    };
}
