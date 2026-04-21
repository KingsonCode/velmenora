import Image from "next/image";
import Link from "next/link";
import type { Broker } from "@/lib/types/broker";
import {
    getBrokerBadges,
    getBrokerDescription,
    getBrokerHighlights,
    getTrustLabel,
} from "@/lib/brokers/card";

type BrokerCardVariant = "full" | "compact" | "inline";

type Props = {
    broker: Broker;
    rank?: number;
    variant?: BrokerCardVariant;
    highlight?: boolean;
    countryLabel?: string;
    ctaSource?: string;
    className?: string;
    onClick?: () => void;
};

function getInitials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function BrokerCard({
    broker,
    rank,
    variant = "full",
    highlight = false,
    countryLabel,
    ctaSource,
    className = "",
    onClick,
}: Props) {
    const badges = getBrokerBadges(broker);
    const highlights = getBrokerHighlights(broker);
    const description = getBrokerDescription(broker);
    const trustLabel = getTrustLabel(broker);

    const isCompact = variant === "compact";
    const isInline = variant === "inline";

    return (
        <article
            className={[
                "relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300",
                highlight
                    ? "scale-[1.03] border-green-700 bg-gradient-to-br from-green-900/40 to-black shadow-xl"
                    : "border-gray-800 bg-gray-900 hover:border-gray-600",
                className,
            ].join(" ")}
        >
            {highlight && (
                <div className="absolute -top-3 left-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold shadow">
                    🔥 Recommended
                </div>
            )}

            <div className="mb-4">
                {typeof rank === "number" && (
                    <div className="mb-3 text-sm font-medium text-green-400">
                        #{rank} Top Pick
                    </div>
                )}

                <div className="flex items-start gap-4">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0b1020]">
                        {broker.logo ? (
                            <Image
                                src={broker.logo}
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
                        <h3 className="mb-2 text-2xl font-bold text-white">
                            {broker.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                            <span className="text-yellow-400">
                                ⭐ {broker.rating?.toFixed(1) ?? "4.5"}
                            </span>
                            <span>•</span>
                            <span>{trustLabel}</span>

                            {countryLabel ? (
                                <>
                                    <span>•</span>
                                    <span>Popular in {countryLabel}</span>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            {badges.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {badges.map((badge) => (
                        <span
                            key={badge}
                            className="rounded border border-green-700 bg-green-900/40 px-2 py-1 text-xs text-green-200"
                        >
                            {badge}
                        </span>
                    ))}
                </div>
            )}

            <div className="mb-5">
                <p className="text-sm leading-relaxed text-gray-400">
                    {description}
                </p>
            </div>

            {!isInline && highlights.length > 0 && (
                <div
                    className={[
                        "mb-5 grid gap-3",
                        isCompact ? "grid-cols-1" : "md:grid-cols-3",
                    ].join(" ")}
                >
                    {highlights.map((item) => (
                        <div
                            key={item}
                            className="rounded-xl border border-gray-800 bg-black/30 px-4 py-3 text-sm text-gray-300"
                        >
                            ✔ {item}
                        </div>
                    ))}
                </div>
            )}

            {!isCompact && broker.payments?.length ? (
                <div className="mb-5 flex flex-wrap gap-2">
                    {broker.payments.slice(0, 4).map((payment) => (
                        <span
                            key={payment}
                            className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-200"
                        >
                            {payment}
                        </span>
                    ))}
                </div>
            ) : null}

            <div className="my-4 border-t border-gray-800" />

            <div className="mt-auto flex flex-col gap-3">
                <Link
                    href={`/brokers/${broker.slug}`}
                    className="text-sm text-blue-400 underline"
                >
                    👉 Read Review
                </Link>

                <a
                    href={`/go/${broker.slug}?src=${ctaSource || `broker_card_${variant}`}`}
                    onClick={onClick}
                    className={[
                        "rounded-xl py-3 text-center text-sm font-semibold text-white transition",
                        highlight
                            ? "bg-green-600 hover:bg-green-500"
                            : "bg-gray-800 hover:bg-gray-700",
                    ].join(" ")}
                >
                    🚀 Open Account
                </a>
            </div>
        </article>
    );
}