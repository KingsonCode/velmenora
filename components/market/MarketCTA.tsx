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

export default function MarketCTA({ pair, country }: Props) {
    const category = getCategory(pair);

    const broker =
        getAllBrokers().find(
            (item) =>
                item.category.includes(category) &&
                (!country ||
                    !item.countries ||
                    item.countries.includes(country) ||
                    item.countries.includes("GLOBAL"))
        ) ??
        getTopBrokers(country, 1)[0];

    if (!broker) return null;

    return (
        <div className="relative overflow-hidden rounded-xl border border-blue-500 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
            {broker.tags?.[0] && (
                <div className="absolute right-3 top-3 rounded bg-white px-2 py-1 text-xs text-black">
                    {broker.tags[0]}
                </div>
            )}

            <h2 className="mb-2 text-2xl font-bold">
                Trade {pair} with {broker.name}
            </h2>

            <p className="mb-4 text-sm text-blue-100">
                {broker.features[0]} • {broker.features[1]}
            </p>

            <p className="mb-4 text-sm text-yellow-300">
                ⭐ {broker.rating} / 5 Rated Broker
            </p>

            <a
                href={`/go/${broker.slug}?src=cta_${pair}`}
                className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
            >
                Open Free Account →
            </a>

            <p className="mt-3 text-xs text-blue-100">
                ⚡ Fast signup • No deposit required
            </p>

            <p className="mt-2 text-xs text-blue-100/80">
                {country ? `Broker selection tailored for ${country}` : "Broker selection based on global availability"}
            </p>
        </div>
    );
}