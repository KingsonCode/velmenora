"use client";

import { getAllBrokers, getTopBrokers } from "@/lib/brokers";
import type { Category, CountryCode } from "@/lib/types/broker";

/* ================= CATEGORY ================= */
function getCategory(pair: string): Category {
    if (pair.includes("XAU") || pair.includes("XAG")) return "CFD";
    if (pair.includes("BTC") || pair.includes("ETH")) return "CRYPTO";
    return "FOREX";
}

export default function MarketCTA({ pair }: { pair: string }) {
    const category = getCategory(pair);

    const country: CountryCode = "TZ"; // unaweza auto later
    const broker =
        getAllBrokers().find(
            (item) =>
                item.category.includes(category) &&
                (!item.countries ||
                    item.countries.includes(country) ||
                    item.countries.includes("GLOBAL"))
        ) ??
        getTopBrokers(country, 1)[0];

    if (!broker) return null;

    return (
        <div className="relative overflow-hidden rounded-xl border border-blue-500 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">

            {/* 🔥 BADGE */}
            {broker.tags?.[0] && (
                <div className="absolute top-3 right-3 text-xs bg-white text-black px-2 py-1 rounded">
                    {broker.tags[0]}
                </div>
            )}

            {/* TITLE */}
            <h2 className="text-2xl font-bold mb-2">
                Trade {pair} with {broker.name}
            </h2>

            {/* SUBTEXT */}
            <p className="text-sm mb-4 text-blue-100">
                {broker.features[0]} • {broker.features[1]}
            </p>

            {/* ⭐ TRUST */}
            <p className="text-sm text-yellow-300 mb-4">
                ⭐ {broker.rating} / 5 Rated Broker
            </p>

            {/* CTA */}
            <a
                href={`/go/${broker.slug}?src=cta_${pair}`}
                className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
            >
                Open Free Account →
            </a>

            {/* 🔥 URGENCY */}
            <p className="text-xs text-blue-100 mt-3">
                ⚡ Fast signup • No deposit required
            </p>
        </div>
    );
}
