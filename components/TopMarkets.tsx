"use client";

import Link from "next/link";
import { getContent, Lang } from "@/lib/i18n";

/* ================= TYPES ================= */
type Props = {
    lang?: Lang;
};

/* ================= DATA ================= */
const markets = [
    {
        pair: "GBPUSD",
        name: {
            en: "British Pound vs US Dollar",
            ar: "الجنيه الإسترليني مقابل الدولار",
            de: "Britisches Pfund vs US-Dollar",
            fr: "Livre sterling vs dollar",
        },
        trend: "bullish",
        change: "+0.42%",
        volume: "High",
    },
    {
        pair: "EURUSD",
        name: {
            en: "Euro vs US Dollar",
            ar: "اليورو مقابل الدولار",
            de: "Euro vs US-Dollar",
            fr: "Euro vs dollar",
        },
        trend: "bearish",
        change: "-0.18%",
        volume: "Medium",
    },
    {
        pair: "XAUUSD",
        name: {
            en: "Gold vs US Dollar",
            ar: "الذهب مقابل الدولار",
            de: "Gold vs US-Dollar",
            fr: "Or vs dollar",
        },
        trend: "bullish",
        change: "+0.67%",
        volume: "Very High",
    },
];

/* ================= I18N ================= */
const text = {
    en: {
        title: "Popular Markets",
        subtitle:
            "Explore the most traded forex pairs with live insights and opportunities",
        viewAll: "View all →",
        bullish: "Bullish",
        bearish: "Bearish",
        vol: "Vol",
        analysis: "View analysis →",
        trade: "Trade",
    },
    ar: {
        title: "الأسواق الشائعة",
        subtitle: "استكشف أكثر الأزواج تداولاً مع تحليلات مباشرة",
        viewAll: "عرض الكل →",
        bullish: "صاعد",
        bearish: "هابط",
        vol: "الحجم",
        analysis: "عرض التحليل →",
        trade: "تداول",
    },
    de: {
        title: "Beliebte Märkte",
        subtitle:
            "Entdecke die meistgehandelten Forex-Paare mit Einblicken",
        viewAll: "Alle anzeigen →",
        bullish: "Steigend",
        bearish: "Fallend",
        vol: "Vol",
        analysis: "Analyse anzeigen →",
        trade: "Handeln",
    },
    fr: {
        title: "Marchés populaires",
        subtitle:
            "Découvrez les paires forex les plus échangées",
        viewAll: "Voir tout →",
        bullish: "Haussier",
        bearish: "Baissier",
        vol: "Vol",
        analysis: "Voir analyse →",
        trade: "Trader",
    },
};

/* ================= HELPERS ================= */
function formatPair(pair: string) {
    return `${pair.slice(0, 3)}/${pair.slice(3)}`;
}

/* ================= COMPONENT ================= */
export default function TopMarkets({ lang = "en" }: Props) {
    const t = text[lang] || text.en;

    return (
        <section className="relative max-w-6xl mx-auto px-4 py-12">

            {/* 🔥 BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-indigo-500/10 blur-2xl pointer-events-none" />

            {/* 🔹 HEADER */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {t.title}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {t.subtitle}
                    </p>
                </div>

                <Link
                    href={`/${lang}/markets`}
                    className="text-sm text-blue-400 hover:underline"
                >
                    {t.viewAll}
                </Link>
            </div>

            {/* 🔹 GRID */}
            <div className="grid md:grid-cols-3 gap-5">

                {markets.map((m) => {
                    const isUp = m.trend === "bullish";

                    return (
                        <Link
                            key={m.pair}
                            href={`/${lang}/markets/${m.pair.toLowerCase()}`}
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
                                    {isUp ? t.bullish : t.bearish}
                                </span>
                            </div>

                            {/* 🔹 DESCRIPTION */}
                            <p className="text-sm text-gray-400 mb-4">
                                {m.name[lang] || m.name.en}
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
                                    {t.vol}: {m.volume}
                                </span>
                            </div>

                            {/* 🔹 CTA */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    {t.analysis}
                                </span>

                                <span className="text-xs bg-blue-600 px-3 py-1 rounded-md font-medium">
                                    {t.trade}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}