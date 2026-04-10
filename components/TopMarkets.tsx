"use client";

import Link from "next/link";

/* ================= DATA ================= */

const markets = [
    {
        pair: "GBPUSD",
        name: "British Pound vs US Dollar",
        trend: "bullish",
        change: "+0.42%",
        volume: "High",
    },
    {
        pair: "EURUSD",
        name: "Euro vs US Dollar",
        trend: "bearish",
        change: "-0.18%",
        volume: "Medium",
    },
    {
        pair: "XAUUSD",
        name: "Gold vs US Dollar",
        trend: "bullish",
        change: "+0.67%",
        volume: "Very High",
    },
];

/* ================= HELPERS ================= */

function formatPair(pair: string) {
    return `${pair.slice(0, 3)}/${pair.slice(3)}`;
}

/* ================= COMPONENT ================= */

export default function TopMarkets() {
    return (
        <section className="relative max-w-6xl mx-auto px-4 py-12">

            {/* 🔥 BACKGROUND GLOW */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-indigo-500/10 blur-2xl pointer-events-none" />

            {/* 🔹 HEADER */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Popular Markets
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Explore the most traded forex pairs with live insights and opportunities
                    </p>
                </div>

                <Link
                    href="/markets"
                    className="text-sm text-blue-400 hover:underline"
                >
                    View all →
                </Link>
            </div>

            {/* 🔹 GRID */}
            <div className="grid md:grid-cols-3 gap-5">

                {markets.map((m) => {
                    const isUp = m.trend === "bullish";

                    return (
                        <Link
                            key={m.pair}
                            href={`/markets/${m.pair.toLowerCase()}`}
                            className="group relative p-5 rounded-2xl border border-gray-800 bg-[#0B0F1A] hover:border-blue-500 transition-all duration-300 overflow-hidden"
                        >
                            {/* 🔥 HOVER GLOW */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-blue-500/10 to-indigo-500/10" />

                            {/* 🔹 TOP */}
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">
                                    {formatPair(m.pair)}
                                </h3>

                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${isUp
                                            ? "bg-green-500/10 text-green-400"
                                            : "bg-red-500/10 text-red-400"
                                        }`}
                                >
                                    {isUp ? "Bullish" : "Bearish"}
                                </span>
                            </div>

                            {/* 🔹 DESCRIPTION */}
                            <p className="text-sm text-gray-400 mb-4">
                                {m.name}
                            </p>

                            {/* 🔹 STATS */}
                            <div className="flex items-center justify-between text-sm mb-4">
                                <span
                                    className={`font-medium ${isUp ? "text-green-400" : "text-red-400"
                                        }`}
                                >
                                    {m.change}
                                </span>

                                <span className="text-gray-400">
                                    Vol: {m.volume}
                                </span>
                            </div>

                            {/* 🔹 CTA INSIDE CARD */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    View analysis →
                                </span>

                                <span className="text-xs bg-blue-600 px-3 py-1 rounded-md font-medium">
                                    Trade
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}