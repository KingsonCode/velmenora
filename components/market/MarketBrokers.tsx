"use client";

import { getAllBrokers, getTopBrokers } from "@/lib/brokers";
import type { Category, CountryCode } from "@/lib/types/broker";

/* ================= CATEGORY ================= */
function getCategory(pair: string): Category {
    if (pair.includes("XAU") || pair.includes("XAG")) return "CFD";
    if (pair.includes("BTC") || pair.includes("ETH")) return "CRYPTO";
    return "FOREX";
}

type Props = {
    pair: string;
    country?: CountryCode;
};

export default function MarketBrokers({ pair, country }: Props) {
    const category = getCategory(pair);

    const list = getAllBrokers()
        .filter((broker) => broker.category.includes(category))
        .filter((broker) =>
            !country ||
            !broker.countries ||
            broker.countries.includes(country) ||
            broker.countries.includes("GLOBAL")
        )
        .slice(0, 4);

    const fallback = getTopBrokers(country, 4);
    const brokers = list.length > 0 ? list : fallback;

    if (!Array.isArray(brokers) || brokers.length === 0) {
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

    const [top, ...rest] = brokers;
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
                    {country ? `Ranked for ${country}` : "Global ranking"}
                </span>
            </div>

            {/* TOP BROKER */}
            <a
                href={`/go/${top.slug}?src=market_${pair}`}
                className="block rounded-xl border border-blue-500 bg-[#0B0F1A] p-5 transition hover:scale-[1.02]"
            >
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">{top.name}</p>

                    {top.tags?.[0] && (
                        <span className="rounded bg-blue-500 px-2 py-1 text-xs">
                            {top.tags[0]}
                        </span>
                    )}
                </div>

                <p className="mt-1 text-sm text-gray-400">
                    Trade {pair} with top-tier conditions
                </p>

                <p className="mt-2 text-sm text-yellow-400">
                    ⭐ {top.rating} / 5
                </p>

                <ul className="mt-2 space-y-1 text-xs text-gray-400">
                    {top.features.map((f, i) => (
                        <li key={i}>✔ {f}</li>
                    ))}
                </ul>

                <button className="mt-4 w-full rounded-lg bg-blue-500 py-2 text-sm font-semibold text-black hover:bg-blue-600">
                    Start Trading →
                </button>
            </a>

            {/* OTHER BROKERS */}
            {visible.length > 0 && (
                <div className="grid gap-4 md:grid-cols-3">
                    {visible.map((b) => (
                        <a
                            key={b.slug}
                            href={`/go/${b.slug}?src=market_${pair}`}
                            className="rounded-xl border border-gray-800 p-4 transition hover:border-blue-500"
                        >
                            <p className="font-semibold">{b.name}</p>

                            <p className="mt-1 text-xs text-gray-400">
                                ⭐ {b.rating} / 5
                            </p>

                            <p className="mt-2 text-xs text-gray-500">
                                Trade {pair} with low spreads
                            </p>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}