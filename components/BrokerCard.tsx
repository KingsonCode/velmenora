import Link from "next/link";
import type { Broker, CountryCode } from "@/lib/types/broker";
import { GeoResult } from "@/lib/geo";

type Props = {
    broker: Broker;
    country?: CountryCode;
    rank?: number;
    allBrokers?: Broker[];
    highlight?: boolean;
    geo?: GeoResult; // 🔥 FULL GEO ENGINE
};

/* ================= BADGES ================= */
function getBadges(broker: Broker): string[] {
    const badges: string[] = [];

    const text = (broker.features || []).join(" ").toLowerCase();

    if (text.includes("instant") || text.includes("fast")) {
        badges.push("⚡ Fast Withdrawal");
    }

    if (text.includes("bonus") || broker.tags?.includes("beginner")) {
        badges.push("🎯 Beginner Friendly");
    }

    if (text.includes("low spread") || broker.tags?.includes("low-spread")) {
        badges.push("💰 Low Spread");
    }

    if ((broker.conversion?.trustLevel ?? 0) >= 8) {
        badges.push("🛡️ Trusted");
    }

    return badges.slice(0, 3);
}

/* ================= SMART EXPLANATION ================= */
function getExplanation(
    broker: Broker,
    geo?: GeoResult,
    rank?: number
): string | null {
    if (!geo) return null;

    const explanations: string[] = [];

    /* 🥇 TOP */
    if (rank === 1) {
        explanations.push("🔥 Best choice right now");
    }

    /* 💳 PAYMENT MATCH */
    const match = broker.payments?.find((p) =>
        geo.payments?.includes(p)
    );

    if (match) {
        explanations.push(`💸 Supports ${match}`);
    }

    /* 🎯 INTENT */
    if (geo.intent === "beginner" && broker.tags?.includes("beginner")) {
        explanations.push("🎯 Great for beginners");
    }

    if (
        geo.intent === "pro" &&
        (broker.tags?.includes("pro") || broker.tags?.includes("low-spread"))
    ) {
        explanations.push("⚡ Built for serious traders");
    }

    /* 🌍 REGION BOOST */
    if (
        broker.regions?.includes("AFRICA") &&
        geo.cluster === "AFRICA"
    ) {
        explanations.push("🌍 Optimized for your region");
    }

    return explanations[0] || null;
}

/* ================= COMPONENT ================= */
export default function BrokerCard({
    broker,
    country: _country,
    rank,
    allBrokers: _allBrokers,
    highlight = false,
    geo,
}: Props) {
    const badges = getBadges(broker);
    const explanation = getExplanation(broker, geo, rank);

    return (
        <div
            className={`
        relative flex flex-col justify-between
        p-6 rounded-2xl border transition-all duration-300
        ${highlight
                    ? "bg-gradient-to-br from-green-900/40 to-black border-green-700 shadow-xl scale-[1.03]"
                    : "bg-gray-900 border-gray-800 hover:border-gray-600"
                }
      `}
        >
            {/* 🔥 TOP BADGE */}
            {highlight && (
                <div className="absolute -top-3 left-4 bg-green-600 text-xs px-3 py-1 rounded-full font-semibold shadow">
                    🔥 Recommended
                </div>
            )}

            {/* 🔝 HEADER */}
            <div className="mb-4">

                {/* RANK */}
                {rank && (
                    <div className="text-sm text-green-400 mb-1 font-medium">
                        #{rank} Top Pick
                    </div>
                )}

                {/* NAME */}
                <h3 className="text-2xl font-bold mb-2">
                    {broker.name}
                </h3>

                {/* ⭐ RATING */}
                <div className="text-yellow-400 text-lg">
                    ⭐ {broker.rating ?? "4.5"}
                </div>

            </div>

            {/* 🔥 SMART EXPLANATION */}
            {explanation && (
                <div className="mb-4 text-sm bg-green-900/30 border border-green-700 px-3 py-2 rounded-lg text-green-300">
                    {explanation}
                </div>
            )}

            {/* 🔥 BADGES */}
            {badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {badges.map((badge) => (
                        <span
                            key={badge}
                            className="text-xs bg-green-900/40 border border-green-700 px-2 py-1 rounded"
                        >
                            {badge}
                        </span>
                    ))}
                </div>
            )}

            {/* 🔥 FEATURES */}
            <div className="mb-5">
                <p className="text-gray-400 text-sm leading-relaxed">
                    {broker.features?.join(", ") ||
                        "Low spreads, fast execution"}
                </p>
            </div>

            {/* 🔥 TAGS */}
            {broker.tags && (
                <div className="flex flex-wrap gap-2 mb-5">
                    {broker.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="text-xs bg-gray-800 px-2 py-1 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* 🔥 DIVIDER */}
            <div className="border-t border-gray-800 my-4" />

            {/* 🔥 CTA */}
            <div className="flex flex-col gap-3 mt-auto">

                <Link
                    href={`/brokers/${broker.slug}`}
                    className="text-blue-400 text-sm underline"
                >
                    👉 Read Review
                </Link>

                <a
                    href={`/go/${broker.slug}?src=card`}
                    className={`
            text-center py-3 rounded-xl font-semibold transition text-sm
            ${highlight
                            ? "bg-green-600 hover:bg-green-500"
                            : "bg-gray-800 hover:bg-gray-700"
                        }
          `}
                >
                    🚀 Open Account
                </a>

            </div>
        </div>
    );
}
