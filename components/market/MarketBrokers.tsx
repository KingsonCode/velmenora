"use client";

import { getTopBrokers, BrokerCategory } from "@/lib/brokers";

/* ================= CATEGORY ================= */
function getCategory(pair: string): BrokerCategory {
    if (pair.includes("XAU") || pair.includes("XAG")) return "gold";
    if (pair.includes("BTC") || pair.includes("ETH")) return "crypto";
    return "forex";
}

export default function MarketBrokers({ pair }: { pair: string }) {
    const category = getCategory(pair);
    const country = "TZ";

    const list = getTopBrokers(category, country);

    /* ✅ HARD TYPE NARROWING (TS TRUSTS THIS) */
    if (!Array.isArray(list) || list.length === 0) {
        return (
            <div id="brokers" className="space-y-4">
                <h2 className="text-xl font-semibold">
                    Brokers for {pair}
                </h2>
                <p className="text-sm text-gray-400">
                    No brokers available at the moment.
                </p>
            </div>
        );
    }

    /* 🔥 DESTRUCTURING (SAFE + NARROWED) */
    const [top, ...rest] = list;

    /* 🚨 EXTRA SAFETY (TS 100% GUARANTEED) */
    if (!top) return null;

    const visible = rest.slice(0, 3);

    return (
        <div id="brokers" className="space-y-6 scroll-mt-24">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                    Best Brokers for {pair}
                </h2>
                <span className="text-xs text-gray-500">
                    Ranked for {country}
                </span>
            </div>

            {/* 🔥 TOP BROKER */}
            <a
                href={`/go/${top.slug}?src=market_${pair}`}
                className="block p-5 rounded-xl border border-blue-500 bg-[#0B0F1A] hover:scale-[1.02] transition"
            >
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">{top.name}</p>

                    {top.badge && (
                        <span className="text-xs bg-blue-500 px-2 py-1 rounded">
                            {top.badge}
                        </span>
                    )}
                </div>

                <p className="text-sm text-gray-400 mt-1">
                    Trade {pair} with top-tier conditions
                </p>

                {/* ⭐ RATING */}
                <p className="text-yellow-400 text-sm mt-2">
                    ⭐ {top.rating} / 5
                </p>

                {/* FEATURES */}
                <ul className="text-xs text-gray-400 mt-2 space-y-1">
                    {top.features.map((f, i) => (
                        <li key={i}>✔ {f}</li>
                    ))}
                </ul>

                {/* CTA */}
                <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-black py-2 rounded-lg text-sm font-semibold">
                    Start Trading →
                </button>
            </a>

            {/* 🧱 OTHER BROKERS */}
            {visible.length > 0 && (
                <div className="grid md:grid-cols-3 gap-4">
                    {visible.map((b) => (
                        <a
                            key={b.slug}
                            href={`/go/${b.slug}?src=market_${pair}`}
                            className="p-4 border border-gray-800 rounded-xl hover:border-blue-500 transition"
                        >
                            <p className="font-semibold">{b.name}</p>

                            <p className="text-xs text-gray-400 mt-1">
                                ⭐ {b.rating} / 5
                            </p>

                            <p className="text-xs text-gray-500 mt-2">
                                Trade {pair} with low spreads
                            </p>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}