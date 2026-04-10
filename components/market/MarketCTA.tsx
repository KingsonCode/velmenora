"use client";

import { getTopBrokers, BrokerCategory } from "@/lib/brokers";

/* ================= CATEGORY ================= */
function getCategory(pair: string): BrokerCategory {
    if (pair.includes("XAU") || pair.includes("XAG")) return "gold";
    if (pair.includes("BTC") || pair.includes("ETH")) return "crypto";
    return "forex";
}

export default function MarketCTA({ pair }: { pair: string }) {
    const category = getCategory(pair);

    const country = "TZ"; // unaweza auto later
    const broker = getTopBrokers(category, country)[0];

    if (!broker) return null;

    return (
        <div className="relative overflow-hidden rounded-xl border border-blue-500 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">

            {/* 🔥 BADGE */}
            {broker.badge && (
                <div className="absolute top-3 right-3 text-xs bg-white text-black px-2 py-1 rounded">
                    {broker.badge}
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