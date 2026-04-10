"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    pair?: string; // 🔥 allow undefined (defensive)
};

/* ================= SYMBOL RESOLVER ================= */
function getSymbol(pair?: string) {
    if (!pair) return "FX:EURUSD"; // 🔥 fallback (NO CRASH)

    if (pair === "XAUUSD") return "OANDA:XAUUSD";
    if (pair === "XAGUSD") return "OANDA:XAGUSD";
    if (pair === "BTCUSD") return "BITSTAMP:BTCUSD";
    if (pair === "ETHUSD") return "BITSTAMP:ETHUSD";

    if (pair.length === 6) return `FX:${pair}`;

    return pair;
}

export default function MarketChart({ pair }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [interval, setInterval] = useState("15");
    const [loading, setLoading] = useState(true);

    /* 🔥 HARD GUARD */
    if (!pair) return null;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        setLoading(true);
        container.innerHTML = "";

        const script = document.createElement("script");
        script.src =
            "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.async = true;

        script.onload = () => setLoading(false);

        script.innerHTML = JSON.stringify({
            autosize: true,
            symbol: getSymbol(pair),
            interval,
            timezone: "Africa/Nairobi",
            theme: "dark",
            style: "1",
            locale: "en",

            enable_publishing: false,
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: false,

            studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],

            overrides: {
                "paneProperties.background": "#000000",
                "paneProperties.vertGridProperties.color": "#111111",
                "paneProperties.horzGridProperties.color": "#111111",
                "scalesProperties.textColor": "#AAA",
            },
        });

        /* 🔥 DELAY (fix width -1 bug) */
        const timeout = setTimeout(() => {
            container.appendChild(script);
        }, 50);

        return () => {
            clearTimeout(timeout);
            container.innerHTML = "";
        };
    }, [pair, interval]);

    return (
        <div className="rounded-xl border border-gray-800 bg-black p-4 space-y-3">

            {/* 🔥 HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">{pair} Live Chart</h2>
                    <p className="text-xs text-gray-400">Real-time market view</p>
                </div>

                <span className="text-green-400 text-xs font-medium animate-pulse">
                    ● LIVE
                </span>
            </div>

            {/* ⚡ INTERVAL SWITCH */}
            <div className="flex gap-2">
                {[
                    { label: "15m", value: "15" },
                    { label: "1H", value: "60" },
                    { label: "4H", value: "240" },
                    { label: "1D", value: "D" },
                ].map((item) => (
                    <button
                        key={item.value}
                        onClick={() => setInterval(item.value)}
                        className={`px-3 py-1 text-xs rounded-md border ${interval === item.value
                                ? "bg-white text-black border-white"
                                : "border-gray-700 text-gray-400 hover:text-white"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* 📊 CHART */}
            <div className="w-full h-[400px] min-h-[300px]">
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-800">

                    {/* ⏳ LOADING */}
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black">
                            <div className="animate-pulse text-gray-500 text-sm">
                                Loading chart...
                            </div>
                        </div>
                    )}

                    <div ref={containerRef} className="w-full h-full" />
                </div>
            </div>
        </div>
    );
}