"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import WatchlistButton from "@/components/market/WatchlistButton";

/* ================= TYPES ================= */
type Props = {
    pair: string;
    lang: Lang;
    name?: string;
};

/* ================= HELPERS ================= */
function formatPair(pair: string) {
    const clean = pair.replace("/", "").toUpperCase();

    if (clean.length === 6) {
        return `${clean.slice(0, 3)}/${clean.slice(3)}`;
    }

    return pair.toUpperCase();
}

function getSession(lang: Lang) {
    const hour = new Date().getUTCHours();

    const session =
        hour >= 7 && hour < 16
            ? "london"
            : hour >= 12 && hour < 21
                ? "newyork"
                : hour >= 0 && hour < 9
                    ? "asian"
                    : "mixed";

    const labels = {
        en: {
            london: "London Session",
            newyork: "New York Session",
            asian: "Asian Session",
            mixed: "Mixed Session",
        },
        ar: {
            london: "جلسة لندن",
            newyork: "جلسة نيويورك",
            asian: "الجلسة الآسيوية",
            mixed: "جلسة مختلطة",
        },
        de: {
            london: "London-Session",
            newyork: "New-York-Session",
            asian: "Asiatische Session",
            mixed: "Gemischte Session",
        },
        fr: {
            london: "Session de Londres",
            newyork: "Session de New York",
            asian: "Session asiatique",
            mixed: "Session mixte",
        },
    };

    return labels[lang][session];
}

function getBasePrice(pair: string) {
    const clean = pair.replace("/", "").toLowerCase();

    const map: Record<string, number> = {
        eurusd: 1.0842,
        gbpusd: 1.2714,
        usdjpy: 149.62,
        xauusd: 2348.2,
        btcusd: 64250.4,
        ethusd: 3128.6,
    };

    return map[clean] ?? 1.25;
}

function getSpread(pair: string) {
    const clean = pair.replace("/", "").toLowerCase();

    const map: Record<string, string> = {
        eurusd: "0.8 pips",
        gbpusd: "1.1 pips",
        usdjpy: "0.9 pips",
        xauusd: "18 pts",
        btcusd: "24 pts",
        ethusd: "3.8 pts",
    };

    return map[clean] ?? "0.8 pips";
}

function getVolatilityLabel(pair: string, lang: Lang) {
    const clean = pair.replace("/", "").toLowerCase();

    const level =
        clean === "btcusd" || clean === "ethusd"
            ? "high"
            : clean === "xauusd"
                ? "mediumHigh"
                : "medium";

    const labels = {
        en: {
            high: "High",
            mediumHigh: "Medium-High",
            medium: "Medium",
        },
        ar: {
            high: "مرتفع",
            mediumHigh: "متوسط إلى مرتفع",
            medium: "متوسط",
        },
        de: {
            high: "Hoch",
            mediumHigh: "Mittel-Hoch",
            medium: "Mittel",
        },
        fr: {
            high: "Élevée",
            mediumHigh: "Moyenne à élevée",
            medium: "Moyenne",
        },
    };

    return {
        text: labels[lang][level],
        tone:
            level === "high"
                ? "text-red-300"
                : level === "mediumHigh"
                    ? "text-amber-300"
                    : "text-yellow-300",
    };
}

const text = {
    en: {
        subtitleSuffix: "Live chart, analysis and trading opportunities",
        session: "Session",
        spread: "Spread",
        volatility: "Volatility",
        trend: "Trend",
        bullish: "Bullish",
        bearish: "Bearish",
        tradeNow: "Trade Now",
        share: "Share",
        compareBrokers: "Compare Brokers",
        linkCopied: "Link copied to clipboard",
        shareText: "Check out this market analysis on Velmenora.",
        marketOverview: "Market Overview",
        liveQuote: "Live Quote",
    },
    ar: {
        subtitleSuffix: "رسم بياني مباشر وتحليل وفرص تداول",
        session: "الجلسة",
        spread: "السبريد",
        volatility: "التقلب",
        trend: "الاتجاه",
        bullish: "صاعد",
        bearish: "هابط",
        tradeNow: "ابدأ التداول",
        share: "مشاركة",
        compareBrokers: "قارن الوسطاء",
        linkCopied: "تم نسخ الرابط",
        shareText: "اطلع على تحليل هذا السوق على Velmenora.",
        marketOverview: "نظرة عامة على السوق",
        liveQuote: "سعر مباشر",
    },
    de: {
        subtitleSuffix: "Live-Chart, Analyse und Trading-Chancen",
        session: "Session",
        spread: "Spread",
        volatility: "Volatilität",
        trend: "Trend",
        bullish: "Steigend",
        bearish: "Fallend",
        tradeNow: "Jetzt traden",
        share: "Teilen",
        compareBrokers: "Broker vergleichen",
        linkCopied: "Link in die Zwischenablage kopiert",
        shareText: "Sieh dir diese Marktanalyse auf Velmenora an.",
        marketOverview: "Marktüberblick",
        liveQuote: "Live-Kurs",
    },
    fr: {
        subtitleSuffix: "Graphique en direct, analyse et opportunités de trading",
        session: "Session",
        spread: "Spread",
        volatility: "Volatilité",
        trend: "Tendance",
        bullish: "Haussier",
        bearish: "Baissier",
        tradeNow: "Trader maintenant",
        share: "Partager",
        compareBrokers: "Comparer les brokers",
        linkCopied: "Lien copié dans le presse-papiers",
        shareText: "Consultez cette analyse de marché sur Velmenora.",
        marketOverview: "Vue du marché",
        liveQuote: "Cours en direct",
    },
} satisfies Record<
    Lang,
    {
        subtitleSuffix: string;
        session: string;
        spread: string;
        volatility: string;
        trend: string;
        bullish: string;
        bearish: string;
        tradeNow: string;
        share: string;
        compareBrokers: string;
        linkCopied: string;
        shareText: string;
        marketOverview: string;
        liveQuote: string;
    }
>;

export default function MarketHeader({ pair, lang, name }: Props) {
    const t = text[lang];
    const formatted = formatPair(pair);
    const displayName = name ?? formatted;

    const basePrice = useMemo(() => getBasePrice(pair), [pair]);
    const spread = useMemo(() => getSpread(pair), [pair]);
    const volatility = useMemo(() => getVolatilityLabel(pair, lang), [pair, lang]);

    const [price, setPrice] = useState(basePrice);
    const [change, setChange] = useState(0);

    useEffect(() => {
        setPrice(basePrice);
        setChange(0);

        const interval = setInterval(() => {
            const scale = basePrice > 1000 ? 0.0025 : basePrice > 100 ? 0.0015 : 0.0008;
            const randomMove = (Math.random() - 0.5) * basePrice * scale;

            setPrice((prev) => +(prev + randomMove).toFixed(basePrice > 100 ? 2 : 5));
            setChange((prev) => +(prev + randomMove).toFixed(basePrice > 100 ? 2 : 5));
        }, 2500);

        return () => clearInterval(interval);
    }, [basePrice]);

    async function handleShare() {
        const url = window.location.href;
        const title = `${displayName} | Velmenora`;
        const textValue = t.shareText;

        try {
            if (navigator.share) {
                await navigator.share({
                    title,
                    text: textValue,
                    url,
                });
                return;
            }

            await navigator.clipboard.writeText(url);
            window.alert(t.linkCopied);
        } catch (error) {
            console.error("Share failed:", error);
        }
    }

    const isUp = change >= 0;
    const percent = price !== 0 ? ((change / price) * 100).toFixed(2) : "0.00";

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                    <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300">
                        {t.marketOverview}
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        {displayName}
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-400 sm:text-[15px]">
                        {formatted} — {t.subtitleSuffix}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.28)]">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                        {t.liveQuote}
                    </div>

                    <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
                        {price.toFixed(basePrice > 100 ? 2 : 5)}
                    </div>

                    <div className={`mt-2 text-sm font-medium ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                        {isUp ? "+" : ""}
                        {change.toFixed(basePrice > 100 ? 2 : 5)} ({percent}%)
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                        {t.session}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white">
                        {getSession(lang)}
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                        {t.spread}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white">
                        {spread}
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                        {t.volatility}
                    </div>
                    <div className={`mt-2 text-sm font-semibold ${volatility.tone}`}>
                        {volatility.text}
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                        {t.trend}
                    </div>
                    <div className={`mt-2 text-sm font-semibold ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                        {isUp ? t.bullish : t.bearish}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <a
                    href="/go/exness"
                    className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400"
                >
                    {t.tradeNow}
                </a>

                <WatchlistButton
                    pair={pair}
                    lang={lang}
                    name={displayName}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.05]"
                />

                <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                    {t.share}
                </button>

                <Link
                    href={`/${lang}/country/compare`}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                    {t.compareBrokers}
                </Link>
            </div>
        </div>
    );
}