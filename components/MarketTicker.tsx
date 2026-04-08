"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Sparkline from "./Sparkline";

/* ================= TYPES ================= */
type Market = {
    symbol: string;
    name: string;
    price: string;
    change: number;
    history: number[]; // 🔥 REQUIRED FOR SPARKLINE
};

export default function MarketTicker() {
    const [data, setData] = useState<Market[]>([]);
    const [flashMap, setFlashMap] = useState<
        Record<string, "up" | "down" | null>
    >({});
    const prevPrices = useRef<Record<string, number>>({});

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/markets");
                const json: Market[] = await res.json();

                const newFlash: Record<string, "up" | "down" | null> = {};

                json.forEach((m) => {
                    const current = parseFloat(
                        m.price.toString().replace(/,/g, "")
                    );
                    const prev = prevPrices.current[m.symbol];

                    if (prev !== undefined) {
                        if (current > prev) newFlash[m.symbol] = "up";
                        else if (current < prev) newFlash[m.symbol] = "down";
                        else newFlash[m.symbol] = null;
                    }

                    prevPrices.current[m.symbol] = current;
                });

                setFlashMap(newFlash);
                setData(json);

                /* 🔥 CLEAR FLASH */
                setTimeout(() => {
                    setFlashMap({});
                }, 700);
            } catch (e) {
                console.error("Ticker error", e);
            }
        }

        fetchData();
        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, []);

    /* ================= ITEM ================= */
    const renderItem = (m: Market) => {
        const flash = flashMap[m.symbol];

        return (
            <Link
                key={m.symbol}
                href={`/markets/${m.symbol.replace("/", "").toLowerCase()}`}
                className={`flex items-center gap-3 px-4 py-1 rounded transition-all duration-200 ${flash === "up"
                        ? "bg-green-500/20"
                        : flash === "down"
                            ? "bg-red-500/20"
                            : "hover:bg-white/5"
                    }`}
            >
                {/* SYMBOL */}
                <span className="font-semibold min-w-[70px]">
                    {m.symbol}
                </span>

                {/* 🔥 MINI CHART */}
                <Sparkline data={m.history} />

                {/* PRICE */}
                <span
                    className={`transition-all duration-200 ${flash === "up"
                            ? "text-green-400"
                            : flash === "down"
                                ? "text-red-400"
                                : "text-gray-300"
                        }`}
                >
                    {m.price}
                </span>

                {/* CHANGE */}
                <span
                    className={`font-medium ${m.change >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                >
                    {m.change >= 0 ? "+" : ""}
                    {m.change.toFixed(2)}%
                </span>
            </Link>
        );
    };

    /* ================= UI ================= */
    return (
        <div className="w-full bg-black text-white text-xs border-b border-white/10 overflow-hidden">

            {/* 🔥 TICKER LOOP */}
            <div className="flex whitespace-nowrap animate-ticker hover:[animation-play-state:paused]">

                {data.map(renderItem)}

                {/* 🔥 DUPLICATE LOOP (NO JUMP) */}
                {data.map((m) => (
                    <div key={`dup-${m.symbol}`}>
                        {renderItem(m)}
                    </div>
                ))}

            </div>
        </div>
    );
}