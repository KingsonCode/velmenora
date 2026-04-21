import type { Broker } from "@/lib/types/broker";
import type {
    BrokerHighlight,
    BrokerComparisonRow,
    CountryHighlightCard,
    ConversionFAQ,
    TopBrokerStripItem,
    TopBrokerSummary,
    BuiltCountryPageData,
} from "./types";

/* ================= LOCAL TYPE HELPERS ================= */

type BrokerFeature = NonNullable<Broker["features"]>[number];
type BrokerPayment = NonNullable<Broker["payments"]>[number];

/* ================= CORE HELPERS ================= */

function safeArray<T>(value: T[] | undefined | null): T[] {
    return Array.isArray(value) ? value : [];
}

/* ================= RANKING ================= */

export function rankBrokers(brokers: Broker[]): Broker[] {
    return [...brokers].sort((a, b) => {
        const scoreA = typeof a.rating === "number" ? a.rating : 0;
        const scoreB = typeof b.rating === "number" ? b.rating : 0;

        if (scoreB !== scoreA) return scoreB - scoreA;

        const depositA =
            typeof a.minDeposit === "number"
                ? a.minDeposit
                : Number.MAX_SAFE_INTEGER;

        const depositB =
            typeof b.minDeposit === "number"
                ? b.minDeposit
                : Number.MAX_SAFE_INTEGER;

        return depositA - depositB;
    });
}

/* ================= BADGE ================= */

export function getBrokerBadge(broker: Broker): string | null {
    const features = safeArray<BrokerFeature>(broker.features);
    const payments = safeArray<BrokerPayment>(broker.payments);

    if (features.includes("BEGINNER_FRIENDLY")) return "Best for Beginners";
    if (features.includes("LOW_SPREAD") || features.includes("RAW_SPREAD")) {
        return "Low Spread Pick";
    }
    if (
        payments.includes("MPESA") ||
        payments.includes("TIGO_PESA") ||
        payments.includes("AIRTEL_MONEY")
    ) {
        return "Mobile Money Friendly";
    }
    if (features.includes("FAST_EXECUTION")) return "Fast Execution";
    if (features.includes("COPY_TRADING")) return "Copy Trading";

    return null;
}

/* ================= REASON ================= */

export function getBrokerReason(broker: Broker): string {
    const features = safeArray<BrokerFeature>(broker.features);
    const payments = safeArray<BrokerPayment>(broker.payments);

    if (features.includes("BEGINNER_FRIENDLY")) {
        return "Good fit for new traders who want a simpler learning curve and accessible account setup.";
    }

    if (features.includes("LOW_SPREAD") || features.includes("RAW_SPREAD")) {
        return "Worth considering for traders who care about tighter pricing and lower trading costs.";
    }

    if (
        payments.includes("MPESA") ||
        payments.includes("TIGO_PESA") ||
        payments.includes("AIRTEL_MONEY")
    ) {
        return "Strong option for traders who care about convenient local funding and withdrawals.";
    }

    if (features.includes("FAST_EXECUTION")) {
        return "Relevant for traders who value speed, execution quality, and responsive trading conditions.";
    }

    return "A solid broker to compare based on usability, account access, and overall trading fit.";
}

/* ================= HIGHLIGHTS ================= */

export function getBrokerHighlights(broker: Broker): BrokerHighlight[] {
    const payments = safeArray(broker.payments);
    const platforms = safeArray(broker.platforms);

    return [
        {
            label: "Rating",
            value: broker.rating ? String(broker.rating) : "N/A",
        },
        {
            label: "Min Deposit",
            value:
                broker.minDeposit !== undefined && broker.minDeposit !== null
                    ? `$${broker.minDeposit}`
                    : "N/A",
        },
        {
            label: "Platforms",
            value: platforms.length ? platforms.slice(0, 2).join(", ") : "N/A",
        },
        {
            label: "Payments",
            value: payments.length ? payments.slice(0, 2).join(", ") : "N/A",
        },
    ];
}

/* ================= TOP BROKER ================= */

export function getTopBroker(brokers: Broker[]): Broker | null {
    return rankBrokers(brokers)[0] || null;
}

/* ================= SUMMARY ================= */

export function getTopBrokerSummary(
    broker: Broker | null
): TopBrokerSummary | null {
    if (!broker) return null;

    const badge = getBrokerBadge(broker);

    return {
        title: badge ? `${broker.name} — ${badge}` : `${broker.name} — Top Pick`,
        subtitle:
            getBrokerReason(broker) ||
            "A strong overall choice based on trading fit, accessibility, and broker quality.",
    };
}

/* ================= TOP 3 STRIP ================= */

export function buildTopBrokerStrip(
    brokers: Broker[]
): TopBrokerStripItem[] {
    return rankBrokers(brokers)
        .slice(0, 3)
        .map((broker, index) => ({
            rank: index + 1,
            slug: broker.slug,
            name: broker.name,
            rating: broker.rating ? String(broker.rating) : "N/A",
            minDeposit:
                broker.minDeposit !== undefined && broker.minDeposit !== null
                    ? `$${broker.minDeposit}`
                    : "N/A",
            badge: getBrokerBadge(broker),
        }));
}

/* ================= COUNTRY HIGHLIGHTS ================= */

function hasFeature(broker: Broker, feature: BrokerFeature): boolean {
    return safeArray<BrokerFeature>(broker.features).includes(feature);
}

function hasAnyPayment(broker: Broker, keys: BrokerPayment[]): boolean {
    const payments = safeArray<BrokerPayment>(broker.payments);
    return keys.some((payment) => payments.includes(payment));
}

function pickTopBroker(
    brokers: Broker[],
    predicate: (b: Broker) => boolean
): Broker | null {
    return rankBrokers(brokers).find(predicate) || getTopBroker(brokers);
}

export function buildCountryHighlights(
    brokers: Broker[]
): CountryHighlightCard[] {
    return [
        {
            key: "beginners",
            title: "Best for Beginners",
            broker: pickTopBroker(brokers, (b) =>
                hasFeature(b, "BEGINNER_FRIENDLY")
            ),
            reason:
                "Simple account access and a friendlier starting point for new traders.",
        },
        {
            key: "low-spreads",
            title: "Low Spreads",
            broker: pickTopBroker(
                brokers,
                (b) =>
                    hasFeature(b, "LOW_SPREAD") || hasFeature(b, "RAW_SPREAD")
            ),
            reason:
                "Useful for traders who care about tighter pricing and lower trading costs.",
        },
        {
            key: "fast-withdrawals",
            title: "Fast Withdrawals",
            broker: pickTopBroker(
                brokers,
                (b) =>
                    hasFeature(b, "FAST_EXECUTION") ||
                    hasFeature(b, "INSTANT_WITHDRAWALS")
            ),
            reason:
                "A strong fit for traders who value speed and practical account access.",
        },
        {
            key: "mobile-money",
            title: "Mobile Money Support",
            broker: pickTopBroker(
                brokers,
                (b) =>
                    hasAnyPayment(b, ["MPESA", "TIGO_PESA", "AIRTEL_MONEY"])
            ),
            reason:
                "Helpful for traders who want easier local deposits and withdrawals.",
        },
    ];
}

/* ================= COMPARISON TABLE ================= */

function getBrokerBestFor(broker: Broker): string {
    const features = safeArray<BrokerFeature>(broker.features);
    const payments = safeArray<BrokerPayment>(broker.payments);

    if (features.includes("BEGINNER_FRIENDLY")) return "Beginners";
    if (features.includes("LOW_SPREAD") || features.includes("RAW_SPREAD")) {
        return "Low spreads";
    }
    if (
        payments.includes("MPESA") ||
        payments.includes("TIGO_PESA") ||
        payments.includes("AIRTEL_MONEY")
    ) {
        return "Local funding";
    }
    if (features.includes("FAST_EXECUTION")) return "Fast execution";
    if (features.includes("COPY_TRADING")) return "Copy trading";

    return "General trading";
}

export function buildComparisonRows(
    brokers: Broker[]
): BrokerComparisonRow[] {
    return rankBrokers(brokers)
        .slice(0, 6)
        .map((b) => {
            const platforms = safeArray(b.platforms);
            const payments = safeArray(b.payments);

            return {
                slug: b.slug,
                name: b.name,
                rating: b.rating ? String(b.rating) : "N/A",
                minDeposit:
                    b.minDeposit !== undefined && b.minDeposit !== null
                        ? `$${b.minDeposit}`
                        : "N/A",
                platforms: platforms.length
                    ? platforms.slice(0, 3).join(", ")
                    : "N/A",
                payments: payments.length
                    ? payments.slice(0, 3).join(", ")
                    : "N/A",
                bestFor: getBrokerBestFor(b),
            };
        });
}

/* ================= FAQ ================= */

export function buildConversionFAQ(
    countryName: string
): ConversionFAQ[] {
    return [
        {
            question: `What is the best forex broker in ${countryName}?`,
            answer:
                "The best broker depends on your priorities—costs, funding, ease of use, or platform. Compare a few and test with a small deposit.",
        },
        {
            question: `Which broker is best for beginners in ${countryName}?`,
            answer:
                "Look for low minimum deposits, simple platforms, and good onboarding. Avoid overcomplicated setups early.",
        },
        {
            question: "How do I choose the right broker?",
            answer:
                "Focus on regulation, spreads, platform quality, and withdrawal reliability. Test before scaling up.",
        },
        {
            question: `Are forex brokers safe in ${countryName}?`,
            answer:
                "Safety depends on regulation and track record. Always verify the entity serving your region.",
        },
        {
            question: "Can I withdraw money easily?",
            answer:
                "It varies. Test withdrawals early and prioritize brokers known for smoother payouts.",
        },
    ];
}

/* ================= MAIN BUILDER ================= */

export function buildCountryPageData(
    brokers: Broker[],
    countryName: string
): BuiltCountryPageData {
    const rankedBrokers = rankBrokers(brokers);
    const topBroker = getTopBroker(brokers);

    return {
        rankedBrokers,
        topBroker,
        topBrokerSummary: getTopBrokerSummary(topBroker),
        topBrokerStrip: buildTopBrokerStrip(brokers),
        countryHighlights: buildCountryHighlights(brokers),
        comparisonRows: buildComparisonRows(brokers),
        faq: buildConversionFAQ(countryName),
    };
}