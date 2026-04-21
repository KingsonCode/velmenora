import type { Broker } from "@/lib/types/broker";

export function getBrokerBadges(broker: Broker): string[] {
    const badges: string[] = [];

    if (broker.rating && broker.rating >= 4.8) {
        badges.push("Top Rated");
    }

    if (broker.features?.includes("LOW_SPREAD")) {
        badges.push("Low Spread");
    }

    if (broker.features?.includes("RAW_SPREAD")) {
        badges.push("Raw Spread");
    }

    if (broker.features?.includes("FAST_EXECUTION")) {
        badges.push("Fast Execution");
    }

    if (broker.features?.includes("INSTANT_WITHDRAWALS")) {
        badges.push("Instant Withdrawals");
    }

    if (broker.features?.includes("BEGINNER_FRIENDLY")) {
        badges.push("Beginner Friendly");
    }

    if (broker.features?.includes("COPY_TRADING")) {
        badges.push("Copy Trading");
    }

    if (broker.features?.includes("HIGH_LEVERAGE")) {
        badges.push("High Leverage");
    }

    if (broker.features?.includes("BONUSES")) {
        badges.push("Bonuses");
    }

    return [...new Set(badges)].slice(0, 3);
}

export function getBrokerHighlights(broker: Broker): string[] {
    const highlights: string[] = [];

    if (broker.conversion?.bestFor?.length) {
        highlights.push(...broker.conversion.bestFor);
    }

    if (broker.payments?.includes("MPESA")) {
        highlights.push("M-Pesa deposits");
    }

    if (broker.payments?.includes("CRYPTO")) {
        highlights.push("Crypto funding");
    }

    if (broker.features?.includes("FAST_EXECUTION")) {
        highlights.push("Fast order execution");
    }

    if (broker.features?.includes("LOW_SPREAD")) {
        highlights.push("Competitive spreads");
    }

    if (broker.features?.includes("BEGINNER_FRIENDLY")) {
        highlights.push("Easy for new traders");
    }

    return [...new Set(highlights)].slice(0, 3);
}

export function getBrokerDescription(broker: Broker): string {
    const bestFor = broker.conversion?.bestFor?.[0];
    const categories = broker.category?.join(", ").replaceAll("_", " ");

    if (bestFor) {
        return `${broker.name} is a strong choice for ${bestFor.toLowerCase()}, offering competitive trading conditions and a trusted environment for active traders.`;
    }

    if (categories) {
        return `${broker.name} offers access to ${categories.toLowerCase()} markets with reliable infrastructure, flexible funding methods, and solid trading conditions.`;
    }

    return `${broker.name} offers reliable trading conditions, flexible account access, and a broker setup designed for modern traders.`;
}

export function getTrustLabel(broker: Broker): string {
    const trust = broker.conversion?.trustLevel ?? 0;

    if (trust >= 9) return "High Trust";
    if (trust >= 7) return "Trusted";
    return "Active Broker";
}