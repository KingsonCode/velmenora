"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/* =========================
   SSR SAFE
========================= */
const MarketChart = dynamic(() => import("./market/MarketChart"), {
    ssr: false,
});

/* =========================
   TYPES
========================= */
type Pair = {
    symbol: string;
    price: string;
    change: string;
};

/* =========================
   FALLBACK DATA
========================= */
const pairs: Pair[] = [
    { symbol: "EURUSD", price: "1.08432", change: "+0.12%" },
    { symbol: "GBPUSD", price: "1.27120", change: "+0.08%" },
    { symbol: "XAUUSD", price: "2345.10", change: "+0.45%" },
    { symbol: "USDJPY", price: "151.20", change: "-0.22%" },
];

export default function MarketHeroChart() {
    const mainPair = pairs[0] as Pair;

    const [price, setPrice] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchPrice() {
            try {
                const res = await fetch(`/api/forex/${mainPair.symbol}`, {
                    cache: "no-store",
                });

                if (!res.ok) return;

                const data = await res.json();

                if (mounted && data?.price) {
                    setPrice(Number(data.price).toFixed(5));
                }
            } catch (error) {
                console.error("Price fetch error:", error);
            }
        }

        fetchPrice();
        const interval = setInterval(fetchPrice, 10000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [mainPair.symbol]);

    return (
        <section className="relative isolate border-y border-white/10 py-12 md:py-16">
            <div className="mx-auto max-w-6xl px-4">
                {/* HEADER */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-2 inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-300">
                            Live market snapshot
                        </p>

                        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                            {mainPair.symbol.slice(0, 3)}/{mainPair.symbol.slice(3)} Live Market
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm text-gray-400 md:text-base">
                            Real-time price action, momentum view, and quick access to popular trading pairs.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-left md:text-right">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                            Live price
                        </p>
                        <p className="mt-1 text-2xl font-bold text-emerald-400 md:text-3xl">
                            {price ?? mainPair.price ?? "..."}
                        </p>
                    </div>
                </div>

                {/* CHART CARD */}
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                    <div className="border-b border-white/10 px-5 py-4 md:px-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white md:text-xl">
                                    {mainPair.symbol} Live Chart
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Real-time market view with technical context
                                </p>
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                LIVE
                            </div>
                        </div>
                    </div>

                    {/* HARD CONTAINMENT */}
                    <div className="relative overflow-hidden bg-black">
                        <div className="h-[320px] w-full md:h-[460px]">
                            <MarketChart pair={mainPair.symbol} />
                        </div>
                    </div>
                </div>

                {/* PAIRS GRID */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {pairs.map((p) => {
                        const isPositive = p.change.startsWith("+");

                        return (
                            <Link
                                key={p.symbol}
                                href={`/markets/${p.symbol.toLowerCase()}`}
                                className="group rounded-2xl border border-white/10 bg-[#0B0F1A] p-4 transition hover:border-blue-500/60 hover:bg-white/[0.04]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-base font-semibold text-white">
                                            {p.symbol.slice(0, 3)}/{p.symbol.slice(3)}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-400">{p.price}</p>
                                    </div>

                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isPositive
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : "bg-red-500/10 text-red-400"
                                            }`}
                                    >
                                        {p.change}
                                    </span>
                                </div>

                                <div className="mt-4 text-sm font-medium text-blue-400 transition group-hover:text-blue-300">
                                    View market →
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}