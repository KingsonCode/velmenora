import Image from "next/image";
import Link from "next/link";
import type { Broker, CountryCode } from "@/lib/types/broker";
import { GeoResult } from "@/lib/geo";

type Props = {
    broker: Broker;
    country?: CountryCode;
    rank?: number;
    allBrokers?: Broker[];
    highlight?: boolean;
    geo?: GeoResult;
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

    if (rank === 1) {
        explanations.push("🔥 Best choice right now");
    }

    const match = broker.payments?.find((p) => geo.payments?.includes(p));

    if (match) {
        explanations.push(`💸 Supports ${match}`);
    }

    if (geo.intent === "beginner" && broker.tags?.includes("beginner")) {
        explanations.push("🎯 Great for beginners");
    }

    if (
        geo.intent === "pro" &&
        (broker.tags?.includes("pro") || broker.tags?.includes("low-spread"))
    ) {
        explanations.push("⚡ Built for serious traders");
    }

    if (broker.regions?.includes("AFRICA") && geo.cluster === "AFRICA") {
        explanations.push("🌍 Optimized for your region");
    }

    return explanations[0] || null;
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
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
                rounded-2xl border p-6 transition-all duration-300
                ${highlight
                    ? "scale-[1.03] border-green-700 bg-gradient-to-br from-green-900/40 to-black shadow-xl"
                    : "border-gray-800 bg-gray-900 hover:border-gray-600"
                }
            `}
        >
            {highlight && (
                <div className="absolute -top-3 left-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold shadow">
                    🔥 Recommended
                </div>
            )}

            <div className="mb-4">
                {rank && (
                    <div className="mb-3 text-sm font-medium text-green-400">
                        #{rank} Top Pick
                    </div>
                )}

                <div className="flex items-start gap-4">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0b1020]">
                        {(broker as Broker & { logo?: string }).logo ? (
                            <Image
                                src={(broker as Broker & { logo?: string }).logo as string}
                                alt={`${broker.name} logo`}
                                fill
                                className="object-contain p-2"
                                sizes="64px"
                            />
                        ) : (
                            <span className="text-sm font-bold text-white/70">
                                {getInitials(broker.name)}
                            </span>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="mb-2 text-2xl font-bold">{broker.name}</h3>

                        <div className="text-lg text-yellow-400">
                            ⭐ {broker.rating ?? "4.5"}
                        </div>
                    </div>
                </div>
            </div>

            {explanation && (
                <div className="mb-4 rounded-lg border border-green-700 bg-green-900/30 px-3 py-2 text-sm text-green-300">
                    {explanation}
                </div>
            )}

            {badges.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {badges.map((badge) => (
                        <span
                            key={badge}
                            className="rounded border border-green-700 bg-green-900/40 px-2 py-1 text-xs"
                        >
                            {badge}
                        </span>
                    ))}
                </div>
            )}

            <div className="mb-5">
                <p className="text-sm leading-relaxed text-gray-400">
                    {broker.features?.join(", ") || "Low spreads, fast execution"}
                </p>
            </div>

            {broker.tags && (
                <div className="mb-5 flex flex-wrap gap-2">
                    {broker.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="rounded bg-gray-800 px-2 py-1 text-xs"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="my-4 border-t border-gray-800" />

            <div className="mt-auto flex flex-col gap-3">
                <Link
                    href={`/brokers/${broker.slug}`}
                    className="text-sm text-blue-400 underline"
                >
                    👉 Read Review
                </Link>

                <a
                    href={`/go/${broker.slug}?src=card`}
                    className={`
                        rounded-xl py-3 text-center text-sm font-semibold transition
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