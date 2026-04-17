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

function formatPlatforms(broker: Broker): string {
    return broker.platforms?.length
        ? broker.platforms.join(" / ")
        : "Multiple";
}

export default function BrokerTable() {
    const geo = resolveGeo();

    const brokers: Broker[] = getTopBrokers(toBrokerCountry(geo.country), 5);

    /* 🔥 SMART SORT (RANK + PRIORITY) */
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
        <section className="py-20 px-6 bg-dark text-white">

            {/* 🔥 HEADER */}
            <div className="max-w-6xl mx-auto text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Compare Forex Brokers Side by Side
                </h2>

                <p className="text-gray-400">
                    See spreads, platforms, deposits and choose the best broker for you.
                </p>
            </div>

            {/* 🔥 TABLE */}
            <div className="max-w-6xl mx-auto overflow-x-auto">
                <table className="w-full border-collapse text-sm">

                    {/* HEADER */}
                    <thead>
                        <tr className="text-left text-gray-400 border-b border-white/10">
                            <th className="py-4 px-4">Broker</th>
                            <th className="py-4 px-4">Rating</th>
                            <th className="py-4 px-4">Min Deposit</th>
                            <th className="py-4 px-4">Platforms</th>
                            <th className="py-4 px-4">Features</th>
                            <th className="py-4 px-4 text-center">Action</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {sorted.map((broker, i) => {
                            const isTop = i === 0;

                            return (
                                <tr
                                    key={broker.slug}
                                    className="border-b border-white/5 hover:bg-white/5 transition"
                                >
                                    {/* BROKER */}
                                    <td className="py-4 px-4 font-semibold text-white">
                                        <span className="text-gray-500 mr-2">
                                            #{i + 1}
                                        </span>
                                        {broker.name}

                                        {isTop && (
                                            <span className="ml-2 text-xs bg-yellow-400 text-black px-2 py-1 rounded">
                                                Top
                                            </span>
                                        )}
                                    </td>

                                    {/* RATING */}
                                    <td className="py-4 px-4 text-yellow-400">
                                        ⭐ {broker.rating ?? 4.5}
                                    </td>

                                    {/* MIN DEPOSIT */}
                                    <td className="py-4 px-4">
                                        {broker.minDeposit != null ? `$${broker.minDeposit}` : "$10"}
                                    </td>

                                    {/* PLATFORMS */}
                                    <td className="py-4 px-4">
                                        {formatPlatforms(broker)}
                                    </td>

                                    {/* FEATURES (REPLACES SPREADS) */}
                                    <td className="py-4 px-4 text-gray-400">
                                        {broker.category.slice(0, 2).join(", ")}
                                    </td>

                                    {/* CTA */}
                                    <td className="py-4 px-4 text-center">
                                        <a
                                            href={broker.url}
                                            target="_blank"
                                            className={`inline-block px-5 py-2 rounded-lg font-semibold transition ${isTop
                                                    ? "bg-yellow-400 text-black shadow-lg"
                                                    : "bg-white/10 hover:bg-white/20"
                                                }`}
                                        >
                                            Trade Now
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>

            {/* 🔥 SEO TEXT */}
            <div className="max-w-4xl mx-auto mt-12 text-center text-gray-400 text-sm">
                This comparison table helps traders in{" "}
                {geo.meta?.name || "your region"} choose the best forex broker
                based on trading conditions, platform options and deposit requirements.
            </div>

        </section>
    );
}
