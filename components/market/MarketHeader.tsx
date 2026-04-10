"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ================= TYPES ================= */
type Props = {
    pair: string;
    name?: string; // 🔥 NEW (optional, safe)
};

/* ================= HELPERS ================= */

function formatPair(pair: string) {
    if (pair.length === 6) {
        return `${pair.slice(0, 3)}/${pair.slice(3)}`;
    }
    return pair;
}

function getSession() {
    const hour = new Date().getUTCHours();

    if (hour >= 7 && hour < 16) return "London Session";
    if (hour >= 12 && hour < 21) return "New York Session";
    if (hour >= 0 && hour < 9) return "Asian Session";

    return "Mixed Session";
}

/* ================= COMPONENT ================= */

export default function MarketHeader({ pair, name }: Props) {
    const formatted = formatPair(pair);

    /* 🔥 fallback kama name haipo */
    const displayName = name ?? formatted;

    /* 🔥 MOCK LIVE DATA */
    const [price, setPrice] = useState(1.25);
    const [change, setChange] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomMove = (Math.random() - 0.5) * 0.002;
            setPrice((p) => +(p + randomMove).toFixed(5));
            setChange((c) => +(c + randomMove).toFixed(5));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const isUp = change >= 0;

    return (
        <section className="border-b border-gray-800 bg-[#070B14]">
            <div className="max-w-6xl mx-auto px-4 py-5">

                {/* 🔹 TOP ROW */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* LEFT */}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {displayName}
                        </h1>

                        <p className="text-sm text-gray-400 mt-1">
                            {formatted} Live Forex Chart, Analysis & Trading Opportunities
                        </p>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right">
                        <p className="text-2xl font-semibold">
                            {price.toFixed(5)}
                        </p>

                        <p className={`text-sm ${isUp ? "text-green-400" : "text-red-400"}`}>
                            {isUp ? "+" : ""}
                            {change.toFixed(5)} (
                            {((change / price) * 100).toFixed(2)}%)
                        </p>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">

                    <div className="bg-[#0B0F1A] p-3 rounded-lg border border-gray-800">
                        <p className="text-gray-400">Session</p>
                        <p className="font-semibold">{getSession()}</p>
                    </div>

                    <div className="bg-[#0B0F1A] p-3 rounded-lg border border-gray-800">
                        <p className="text-gray-400">Spread</p>
                        <p className="font-semibold">0.8 pips</p>
                    </div>

                    <div className="bg-[#0B0F1A] p-3 rounded-lg border border-gray-800">
                        <p className="text-gray-400">Volatility</p>
                        <p className="font-semibold text-yellow-400">Medium</p>
                    </div>

                    <div className="bg-[#0B0F1A] p-3 rounded-lg border border-gray-800">
                        <p className="text-gray-400">Trend</p>
                        <p className={`font-semibold ${isUp ? "text-green-400" : "text-red-400"}`}>
                            {isUp ? "Bullish" : "Bearish"}
                        </p>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-3 mt-6">

                    <a
                        href="/go/exness"
                        className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg font-semibold"
                    >
                        Trade Now
                    </a>

                    <button className="border border-gray-700 px-5 py-2 rounded-lg hover:border-gray-500 transition">
                        + Watchlist
                    </button>

                    <button className="border border-gray-700 px-5 py-2 rounded-lg hover:border-gray-500 transition">
                        Share
                    </button>

                    <Link
                        href="/brokers"
                        className="border border-gray-700 px-5 py-2 rounded-lg hover:border-gray-500 transition"
                    >
                        Compare Brokers
                    </Link>
                </div>
            </div>
        </section>
    );
}