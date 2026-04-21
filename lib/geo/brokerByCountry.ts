import { BROKERS } from "@/lib/brokers-data";
import type { Broker, CountryCode } from "@/lib/types/broker";

/* ================= TYPES ================= */

export type BrokerCard = {
    name: string;
    slug: string;
    description: string;
    features: string[];
    cta: string;
    badge: string;
    microCopy: string;
};

/* ================= HELPERS ================= */

function getPriority(broker: Broker): number {
    return broker.priority ?? 0;
}

function mapFeatures(features: Broker["features"] = []): string[] {
    const MAP: Record<string, string> = {
        LOW_SPREAD: "Low spreads",
        FAST_EXECUTION: "Fast execution",
        INSTANT_WITHDRAWALS: "Fast withdrawals",
        BEGINNER_FRIENDLY: "Beginner friendly",
        HIGH_LEVERAGE: "High leverage",
        RAW_SPREAD: "Raw spreads",
        COPY_TRADING: "Copy trading",
        BONUSES: "Bonuses",
        RAZOR_ACCOUNT: "Razor account",
    };

    return features.map((feature) => MAP[feature] || feature);
}

function getBadge(broker: Broker): string {
    const priority = getPriority(broker);

    if (priority >= 9) return "Top Pick";
    if (priority >= 8) return "Recommended";
    if (priority >= 7) return "Popular";
    return "Trusted";
}

function getCTA(slug: string): string {
    switch (slug) {
        case "exness":
            return "Open Account →";
        case "deriv":
            return "Start Trading →";
        case "xm":
            return "Create Account →";
        case "icmarkets":
            return "Trade with IC Markets →";
        case "pepperstone":
            return "Open Pepperstone →";
        case "octa":
            return "Open Octa →";
        case "avatrade":
            return "Join AvaTrade →";
        default:
            return "Get Started →";
    }
}

function getDescription(broker: Broker): string {
    const bySlug: Record<string, string> = {
        exness:
            "A strong all-round option for beginners who want smoother onboarding and practical trading conditions.",
        deriv:
            "A simple starting point for users who want flexible access, lower barriers to entry, and an easier setup flow.",
        xm:
            "A widely recognized broker with a familiar platform experience and a beginner-friendly setup path.",
        octa:
            "A straightforward broker choice for users who want a clean interface and a simpler way to get started.",
        icmarkets:
            "A stronger fit for users who want tighter pricing, faster execution, and a more performance-focused environment.",
        pepperstone:
            "A respected broker for traders who care about execution quality, tooling, and a more refined trading setup.",
        avatrade:
            "A globally recognized broker with a structured setup and broad appeal for users who want a dependable start.",
        axi:
            "A practical broker option for traders who want a clean setup and globally accessible trading conditions.",
        tickmill:
            "A strong choice for users who care about pricing efficiency and a more trading-focused environment.",
        roboforex:
            "A flexible option for traders looking for a familiar setup and broader promotional appeal.",
        fxpro:
            "A recognized broker brand suited for traders who want a stable and professional trading environment.",
        hantec:
            "A simple broker choice for users who want a straightforward setup and practical market access.",
    };

    return (
        bySlug[broker.slug] ||
        `${broker.name} offers a reliable trading environment with practical conditions suitable for both beginners and growing traders.`
    );
}

function getMicroCopy(broker: Broker): string {
    const priority = getPriority(broker);

    if (priority >= 9) {
        return "Takes less than 2 minutes • No risk to explore";
    }

    if (priority >= 8) {
        return "Quick signup • Beginner-friendly flow";
    }

    return "Simple onboarding • Easy to get started";
}

/* ================= CORE ================= */

function filterByGeo(country?: CountryCode | null): Broker[] {
    return BROKERS.filter((broker: Broker) => {
        if (!broker.active) return false;

        if (country && broker.countries?.includes(country)) return true;

        if (broker.regions?.includes("GLOBAL")) return true;

        return false;
    });
}

function sortByPriority(list: Broker[]): Broker[] {
    return [...list].sort(
        (a: Broker, b: Broker) => getPriority(b) - getPriority(a)
    );
}

function buildCard(broker: Broker): BrokerCard {
    return {
        name: broker.name,
        slug: broker.slug,
        description: getDescription(broker),
        features: mapFeatures(broker.features),
        cta: getCTA(broker.slug),
        badge: getBadge(broker),
        microCopy: getMicroCopy(broker),
    };
}

/* ================= PUBLIC ================= */

export function getBrokerCardsByGeo(
    country?: CountryCode | null,
    limit = 3
): BrokerCard[] {
    const filtered = filterByGeo(country);
    const sorted = sortByPriority(filtered);

    return sorted.slice(0, limit).map(buildCard);
}

export function getBrokerCardsBySlugs(
    slugs: string[],
    country?: CountryCode | null
): BrokerCard[] {
    const allowed = new Set(slugs);
    const filtered = filterByGeo(country).filter((broker: Broker) =>
        allowed.has(broker.slug)
    );
    const sorted = sortByPriority(filtered);

    return sorted.map(buildCard);
}