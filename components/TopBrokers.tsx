"use client";

import { getTopBrokers } from "@/lib/brokers";
import { resolveGeo } from "@/lib/geo";
import type { Broker, CountryCode } from "@/lib/types/broker";

const BROKER_COUNTRIES = new Set<CountryCode>([
    "TZ",
    "KE",
    "NG",
    "ZA",
    "UG",
    "GH",
    "GLOBAL",
]);

function toBrokerCountry(code?: string | null): CountryCode {
    return code && BROKER_COUNTRIES.has(code as CountryCode)
        ? (code as CountryCode)
        : "GLOBAL";
}

export default function TopBrokers() {
    const geo = resolveGeo();

    const brokers: Broker[] = getTopBrokers(toBrokerCountry(geo.country), 6);

    /* 🔥 SMART SORT (conversion-first) */
    const sorted = [...brokers].sort((a, b) => {
        const scoreA =
            (a.rating ?? 4.5) +
            (geo.brokers.includes(a.slug) ? 1 : 0);

        const scoreB =
            (b.rating ?? 4.5) +
            (geo.brokers.includes(b.slug) ? 1 : 0);

        return scoreB - scoreA;
    });

    return (
        <section className="py-20 px-6 bg-black text-white">

            {/* ================= HEADER ================= */}
            <div className="max-w-6xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Top Forex Brokers in {geo.meta?.name || "Your Region"}
                </h2>

                <p className="text-gray-400">
                    Compare the best forex brokers with fast withdrawals, low spreads and trusted platforms.
                </p>
            </div>

            {/* ================= GRID ================= */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                {sorted.slice(0, 6).map((broker, i) => {
                    const isTop = i === 0;

                    return (
                        <div
                            key={broker.slug}
                            className={`relative p-6 rounded-xl border transition ${isTop
                                    ? "border-yellow-400 bg-gradient-to-b from-yellow-400/10"
                                    : "border-white/10 hover:border-yellow-400"
                                }`}
                        >
                            {/* 🔥 BADGE */}
                            {isTop && (
                                <div className="absolute top-3 right-3 text-xs bg-yellow-400 text-black px-2 py-1 rounded">
                                    #1 Recommended
                                </div>
                            )}

                            {/* 🔥 RANK */}
                            <div className="text-xs text-gray-500 mb-1">
                                #{i + 1} Broker
                            </div>

                            {/* 🔥 NAME */}
                            <h3 className="text-lg font-semibold mb-2">
                                {broker.name}
                            </h3>

                            {/* 🔥 DESCRIPTION (DERIVED) */}
                            <p className="text-sm text-gray-400 mb-3">
                                {broker.category.join(" • ")}
                            </p>

                            {/* 🔥 RATING */}
                            <div className="flex justify-between items-center mb-3 text-sm">
                                <span className="text-yellow-400">
                                    ⭐ {broker.rating ?? 4.5}
                                </span>

                                <span className="text-green-400">
                                    Trusted
                                </span>
                            </div>

                            {/* 🔥 REGIONS */}
                            <div className="text-xs text-gray-500 mb-4">
                                Available in: {broker.regions?.join(", ") || "Global"}
                            </div>

                            {/* 🔥 PAYMENTS (GEO) */}
                            {geo.payments.length > 0 && (
                                <div className="text-xs text-gray-400 mb-4">
                                    Payments: {geo.payments.join(", ")}
                                </div>
                            )}

                            {/* 🔥 CTA STACK */}
                            <div className="flex gap-3">
                                <a
                                    href={broker.url}
                                    target="_blank"
                                    className="flex-1 text-center bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold"
                                >
                                    Trade Now
                                </a>

                                <a
                                    href={`/brokers/${broker.slug}`}
                                    className="flex-1 text-center border border-white/20 px-4 py-2 rounded-lg text-sm"
                                >
                                    Review
                                </a>
                            </div>

                            {/* 🔥 URGENCY */}
                            {isTop && (
                                <div className="mt-3 text-xs text-yellow-400">
                                    🔥 High signup rate in your region
                                </div>
                            )}
                        </div>
                    );
                })}

            </div>

        </section>
    );
}
