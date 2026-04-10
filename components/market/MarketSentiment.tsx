"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */
type Sentiment = {
    bull: number;
    bear: number;
};

type Props = {
    pair: string;
    sentiment?: Sentiment; // 🔥 optional external data
};

/* ================= INTERNAL ENGINE ================= */
function generateBaseSentiment(pair: string) {
    let hash = 0;
    for (let i = 0; i < pair.length; i++) {
        hash += pair.charCodeAt(i);
    }

    return 45 + (hash % 20); // 45–65
}

export default function MarketSentiment({ pair, sentiment }: Props) {
    /* 🔥 SOURCE OF TRUTH */
    const baseBull = sentiment?.bull ?? generateBaseSentiment(pair);
    const baseBear = sentiment?.bear ?? 100 - baseBull;

    const [bull, setBull] = useState(baseBull);
    const [bear, setBear] = useState(baseBear);

    /* 🔥 LIVE MOVEMENT (only if no external sentiment) */
    useEffect(() => {
        if (sentiment) return; // 🚫 do NOT animate real data

        const interval = setInterval(() => {
            setBull((prev) => {
                const change = Math.random() * 2 - 1;
                let next = prev + change;

                if (next > 70) next = 70;
                if (next < 30) next = 30;

                setBear(100 - next);
                return parseFloat(next.toFixed(1));
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [sentiment]);

    /* ================= SIGNAL ================= */
    const getSignal = () => {
        if (bull > 65) return { label: "Strong Buy", color: "text-green-400" };
        if (bull > 55) return { label: "Buy", color: "text-green-300" };
        if (bear > 65) return { label: "Strong Sell", color: "text-red-400" };
        if (bear > 55) return { label: "Sell", color: "text-red-300" };
        return { label: "Neutral", color: "text-yellow-400" };
    };

    const signal = getSignal();
    const confidence = Math.abs(bull - bear);

    const getExplanation = () => {
        if (signal.label.includes("Buy")) {
            return `${pair} shows bullish pressure with buyers dominating the market momentum.`;
        }
        if (signal.label.includes("Sell")) {
            return `${pair} shows bearish pressure as sellers control the current trend.`;
        }
        return `${pair} is currently ranging with no clear directional bias.`;
    };

    return (
        <div className="bg-[#0B0F1A] p-5 rounded-xl border border-gray-800 space-y-5">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Market Sentiment</h2>
                <span className={`text-sm font-medium ${signal.color}`}>
                    {signal.label}
                </span>
            </div>

            {/* BAR */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Bullish</span>
                    <span>Bearish</span>
                </div>

                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden flex">
                    <div
                        className="bg-green-500 transition-all duration-700"
                        style={{ width: `${bull}%` }}
                    />
                    <div
                        className="bg-red-500 transition-all duration-700"
                        style={{ width: `${bear}%` }}
                    />
                </div>

                <div className="flex justify-between text-xs">
                    <span className="text-green-400 font-medium">{bull.toFixed(1)}%</span>
                    <span className="text-red-400 font-medium">{bear.toFixed(1)}%</span>
                </div>
            </div>

            {/* CONFIDENCE */}
            <div className="flex justify-between text-xs text-gray-400 border-t border-gray-800 pt-3">
                <span>Confidence</span>
                <span className="text-white font-medium">{confidence.toFixed(1)}%</span>
            </div>

            {/* EXPLANATION */}
            <p className="text-xs text-gray-400 leading-relaxed">
                {getExplanation()}
            </p>

            {/* CTA */}
            <button className="w-full bg-green-500 hover:bg-green-600 text-black py-2 rounded-lg text-sm font-semibold transition">
                Trade {pair} Based on Signal →
            </button>
        </div>
    );
}