"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/* 🔥 SSR SAFE */
const MarketChart = dynamic(() => import("./market/MarketChart"), {
    ssr: false,
});

/* 🔥 TYPE */
type Pair = {
    symbol: string;
    price: string;
    change: string;
};

/* 🔥 DATA (fallback only now) */
const pairs: Pair[] = [
    { symbol: "EURUSD", price: "1.08432", change: "+0.12%" },
    { symbol: "GBPUSD", price: "1.27120", change: "+0.08%" },
    { symbol: "XAUUSD", price: "2345.10", change: "+0.45%" },
    { symbol: "USDJPY", price: "151.20", change: "-0.22%" },
];

export default function MarketHeroChart() {
    if (!pairs.length) return null;

    const mainPair = pairs[0]!;

    /* 🔥 LIVE PRICE STATE */
    const [price, setPrice] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchPrice() {
            try {
                const res = await fetch(`/api/forex/${mainPair.symbol}`);
                const data = await res.json();

                if (mounted && data.price) {
                    setPrice(Number(data.price).toFixed(5));
                }
            } catch (e) {
                console.error("Price fetch error:", e);
            }
        }

        fetchPrice();

        const interval = setInterval(fetchPrice, 10000); // 🔥 10s refresh

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [mainPair.symbol]);

    return (
        <section className="border-y border-white/10 py-8 space-y-6">

            {/* 🔥 HERO */}
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {mainPair.symbol.slice(0, 3)}/{mainPair.symbol.slice(3)} Live Market
                        </h2>
                        <p className="text-sm text-gray-400">
                            Real-time chart & sentiment overview
                        </p>
                    </div>

                    {/* 🔥 LIVE PRICE */}
                    <div className="text-green-400 font-semibold text-lg">
                        {price ?? mainPair.price ?? "..."}
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="w-full h-[350px]">
                        <MarketChart pair={mainPair.symbol} />
                    </div>
                </div>
            </div>

            {/* 🔥 PAIRS STRIP */}
            <div className="flex gap-4 overflow-x-auto px-4 max-w-6xl mx-auto">
                {pairs.map((p) => {
                    const isPositive = p.change.startsWith("+");

                    return (
                        <Link
                            key={p.symbol}
                            href={`/markets/${p.symbol}`}
                            className="min-w-[150px] bg-[#0B0F1A] p-3 rounded-lg border border-gray-800 hover:border-blue-500 transition"
                        >
                            <p className="font-semibold">
                                {p.symbol.slice(0, 3)}/{p.symbol.slice(3)}
                            </p>

                            {/* 🔥 fallback for now */}
                            <p className="text-xs text-gray-400">{p.price}</p>

                            <p
                                className={`text-sm font-medium ${isPositive ? "text-green-400" : "text-red-400"
                                    }`}
                            >
                                {p.change}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}