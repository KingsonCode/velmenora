"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
    pair?: string;
};

/* ================= HELPERS ================= */
function normalizePair(pair?: string) {
    if (!pair) return "EURUSD";
    return pair.replace("/", "").toUpperCase();
}

function formatPair(pair?: string) {
    const clean = normalizePair(pair);

    if (clean.length === 6) {
        return `${clean.slice(0, 3)}/${clean.slice(3)}`;
    }

    return clean;
}

/* ================= SYMBOL RESOLVER ================= */
function getSymbol(pair?: string) {
    const clean = normalizePair(pair);

    if (clean === "XAUUSD") return "OANDA:XAUUSD";
    if (clean === "XAGUSD") return "OANDA:XAGUSD";
    if (clean === "BTCUSD") return "BITSTAMP:BTCUSD";
    if (clean === "ETHUSD") return "BITSTAMP:ETHUSD";

    if (clean.length === 6) return `FX:${clean}`;

    return `FX:${clean}`;
}

const INTERVALS = [
    { label: "15m", value: "15" },
    { label: "1H", value: "60" },
    { label: "4H", value: "240" },
    { label: "1D", value: "D" },
] as const;

export default function MarketChart({ pair }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [interval, setInterval] =
        useState<(typeof INTERVALS)[number]["value"]>("15");
    const [loading, setLoading] = useState(true);

    const normalizedPair = useMemo(() => normalizePair(pair), [pair]);
    const formattedPair = useMemo(() => formatPair(pair), [pair]);
    const symbol = useMemo(() => getSymbol(pair), [pair]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        setLoading(true);
        container.innerHTML = "";

        const widgetContainer = document.createElement("div");
        widgetContainer.className = "tradingview-widget-container__widget";
        widgetContainer.style.height = "100%";
        widgetContainer.style.width = "100%";

        const script = document.createElement("script");
        script.src =
            "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;

        script.onload = () => {
            setLoading(false);
        };

        script.onerror = () => {
            setLoading(false);
        };

        script.innerHTML = JSON.stringify({
            autosize: true,
            symbol,
            interval,
            timezone: "Africa/Nairobi",
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: false,
            allow_symbol_change: false,
            hide_side_toolbar: false,
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: false,
            studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
            overrides: {
                "paneProperties.background": "#050811",
                "paneProperties.vertGridProperties.color": "#111827",
                "paneProperties.horzGridProperties.color": "#111827",
                "scalesProperties.textColor": "#9CA3AF",
            },
        });

        const timeout = window.setTimeout(() => {
            container.appendChild(widgetContainer);
            container.appendChild(script);
        }, 50);

        return () => {
            window.clearTimeout(timeout);
            container.innerHTML = "";
        };
    }, [symbol, interval]);

    return (
        <section className="overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#0B0F1A_0%,#090D16_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="border-b border-white/10 px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300">
                            Live Chart
                        </div>

                        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                            {formattedPair} Price Action
                        </h2>

                        <p className="mt-2 text-sm text-gray-400">
                            Real-time technical view for {normalizedPair}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            Live
                        </span>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-right">
                            <div className="text-[11px] uppercase tracking-[0.14em] text-gray-500">
                                Symbol
                            </div>
                            <div className="mt-1 text-sm font-semibold text-white">
                                {normalizedPair}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-white/10 px-4 py-4 sm:px-5">
                <div className="flex flex-wrap gap-2">
                    {INTERVALS.map((item) => {
                        const active = interval === item.value;

                        return (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => setInterval(item.value)}
                                className={`inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-xs font-medium transition ${active
                                        ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                                        : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                                    }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-3 sm:p-4">
                <div className="relative h-[420px] min-h-[320px] w-full overflow-hidden rounded-[20px] border border-white/10 bg-[#050811]">
                    {loading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#050811]/95 backdrop-blur-sm">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center">
                                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />
                                <div className="text-sm font-medium text-white">
                                    Loading chart...
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    Preparing live market view
                                </div>
                            </div>
                        </div>
                    )}

                    <div
                        ref={containerRef}
                        className="tradingview-widget-container h-full w-full"
                    />
                </div>
            </div>
        </section>
    );
}