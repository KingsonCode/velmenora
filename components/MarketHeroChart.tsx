"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

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

type Props = {
    lang?: Lang;
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

const text = {
    en: {
        badge: "Live market snapshot",
        title: "Live Market Overview",
        subtitle:
            "Track real-time price action, momentum, and quick access to the most watched trading pairs.",
        livePrice: "Live price",
        liveChart: "Live Chart",
        chartSubtitle: "Real-time market view with technical context",
        live: "LIVE",
        viewMarket: "View market",
    },
    ar: {
        badge: "لقطة مباشرة للسوق",
        title: "نظرة مباشرة على السوق",
        subtitle:
            "تابع حركة الأسعار اللحظية والزخم والوصول السريع إلى أكثر الأزواج متابعة.",
        livePrice: "السعر المباشر",
        liveChart: "الرسم المباشر",
        chartSubtitle: "عرض مباشر للسوق مع سياق فني",
        live: "مباشر",
        viewMarket: "عرض السوق",
    },
    de: {
        badge: "Live-Marktüberblick",
        title: "Live-Marktübersicht",
        subtitle:
            "Verfolge Kursbewegung in Echtzeit, Momentum und schnellen Zugriff auf die meistbeobachteten Märkte.",
        livePrice: "Live-Kurs",
        liveChart: "Live-Chart",
        chartSubtitle: "Echtzeit-Marktblick mit technischem Kontext",
        live: "LIVE",
        viewMarket: "Markt ansehen",
    },
    fr: {
        badge: "Instantané du marché en direct",
        title: "Vue du marché en direct",
        subtitle:
            "Suivez le mouvement des prix en temps réel, le momentum et l’accès rapide aux paires les plus suivies.",
        livePrice: "Prix en direct",
        liveChart: "Graphique en direct",
        chartSubtitle: "Vue du marché en temps réel avec contexte technique",
        live: "DIRECT",
        viewMarket: "Voir le marché",
    },
} satisfies Record<
    Lang,
    {
        badge: string;
        title: string;
        subtitle: string;
        livePrice: string;
        liveChart: string;
        chartSubtitle: string;
        live: string;
        viewMarket: string;
    }
>;

function formatPair(symbol: string) {
    const clean = symbol.replace("/", "").toUpperCase();

    if (clean.length === 6) {
        return `${clean.slice(0, 3)}/${clean.slice(3)}`;
    }

    return clean;
}

function formatPrice(symbol: string, value: number) {
    if (symbol === "XAUUSD" || symbol === "USDJPY") {
        return value.toFixed(2);
    }

    return value.toFixed(5);
}

export default function MarketHeroChart({ lang = "en" }: Props) {
    const t = text[lang];
    const mainPair = useMemo(() => pairs[0] as Pair, []);
    const [price, setPrice] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchPrice() {
            try {
                const res = await fetch(`/api/forex/${mainPair.symbol.toLowerCase()}`, {
                    cache: "no-store",
                });

                if (!res.ok) return;

                const data = await res.json();

                if (mounted && data?.price) {
                    setPrice(formatPrice(mainPair.symbol, Number(data.price)));
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
        <section className="relative isolate overflow-hidden py-12 md:py-16">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute right-0 top-10 h-[220px] w-[220px] rounded-full bg-blue-500/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="mb-3 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300">
                            {t.badge}
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                            {t.title}
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 md:text-[15px]">
                            {t.subtitle}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left shadow-[0_12px_40px_rgba(0,0,0,0.28)] lg:text-right">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                            {t.livePrice}
                        </p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight text-cyan-300">
                            {price ?? mainPair.price ?? "..."}
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#0B0F1A_0%,#090D16_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                    <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                                    {formatPair(mainPair.symbol)} {t.liveChart}
                                </h3>
                                <p className="mt-2 text-sm text-gray-400">{t.chartSubtitle}</p>
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                                {t.live}
                            </div>
                        </div>
                    </div>

                    <div className="p-3 sm:p-4">
                        <MarketChart pair={mainPair.symbol} />
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {pairs.map((p) => {
                        const isPositive = p.change.startsWith("+");

                        return (
                            <Link
                                key={p.symbol}
                                href={`/${lang}/country/markets/${p.symbol.toLowerCase()}`}
                                className="group rounded-[22px] border border-white/10 bg-white/[0.02] p-4 transition hover:border-cyan-400/20 hover:bg-white/[0.04]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-base font-semibold text-white">
                                            {formatPair(p.symbol)}
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

                                <div className="mt-4 text-sm font-medium text-cyan-300 transition group-hover:text-cyan-200">
                                    {t.viewMarket} →
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}