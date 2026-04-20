"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";

/* ================= TYPES ================= */
type Sentiment = {
    bull: number;
    bear: number;
};

type Props = {
    pair: string;
    lang: Lang;
    sentiment?: Sentiment;
};

/* ================= HELPERS ================= */
function formatPair(pair: string) {
    const clean = pair.replace("/", "").toUpperCase();

    if (clean.length === 6) {
        return `${clean.slice(0, 3)}/${clean.slice(3)}`;
    }

    return pair.toUpperCase();
}

function generateBaseSentiment(pair: string) {
    let hash = 0;

    for (let i = 0; i < pair.length; i++) {
        hash += pair.charCodeAt(i);
    }

    return 45 + (hash % 20);
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

const text = {
    en: {
        title: "Market Sentiment",
        bullish: "Bullish",
        bearish: "Bearish",
        confidence: "Confidence",
        strongBuy: "Strong Buy",
        buy: "Buy",
        strongSell: "Strong Sell",
        sell: "Sell",
        neutral: "Neutral",
        trade: "Trade",
        basedOnSignal: "Based on Signal",
        bullishExplanation:
            "shows bullish pressure with buyers dominating the current market momentum.",
        bearishExplanation:
            "shows bearish pressure as sellers control the current trend.",
        neutralExplanation:
            "is currently ranging with no clear directional bias.",
        sentimentPulse: "Sentiment Pulse",
        liveBias: "Live Bias",
    },
    ar: {
        title: "معنويات السوق",
        bullish: "صاعد",
        bearish: "هابط",
        confidence: "الثقة",
        strongBuy: "شراء قوي",
        buy: "شراء",
        strongSell: "بيع قوي",
        sell: "بيع",
        neutral: "محايد",
        trade: "تداول",
        basedOnSignal: "بناءً على الإشارة",
        bullishExplanation:
            "يُظهر ضغطاً صاعداً مع سيطرة المشترين على زخم السوق الحالي.",
        bearishExplanation:
            "يُظهر ضغطاً هابطاً مع سيطرة البائعين على الاتجاه الحالي.",
        neutralExplanation:
            "يتحرك حالياً بشكل عرضي دون اتجاه واضح.",
        sentimentPulse: "نبض السوق",
        liveBias: "التحيز الحالي",
    },
    de: {
        title: "Marktstimmung",
        bullish: "Steigend",
        bearish: "Fallend",
        confidence: "Vertrauen",
        strongBuy: "Starker Kauf",
        buy: "Kaufen",
        strongSell: "Starker Verkauf",
        sell: "Verkaufen",
        neutral: "Neutral",
        trade: "Handeln",
        basedOnSignal: "Basierend auf Signal",
        bullishExplanation:
            "zeigt bullischen Druck, da Käufer die aktuelle Marktdynamik dominieren.",
        bearishExplanation:
            "zeigt bärischen Druck, da Verkäufer den aktuellen Trend kontrollieren.",
        neutralExplanation:
            "bewegt sich aktuell seitwärts ohne klare Richtung.",
        sentimentPulse: "Sentiment-Puls",
        liveBias: "Live-Bias",
    },
    fr: {
        title: "Sentiment du marché",
        bullish: "Haussier",
        bearish: "Baissier",
        confidence: "Confiance",
        strongBuy: "Achat fort",
        buy: "Acheter",
        strongSell: "Vente forte",
        sell: "Vendre",
        neutral: "Neutre",
        trade: "Trader",
        basedOnSignal: "Selon le signal",
        bullishExplanation:
            "montre une pression haussière avec des acheteurs dominant la dynamique actuelle du marché.",
        bearishExplanation:
            "montre une pression baissière alors que les vendeurs contrôlent la tendance actuelle.",
        neutralExplanation:
            "évolue actuellement sans direction claire.",
        sentimentPulse: "Pouls du marché",
        liveBias: "Biais en direct",
    },
} satisfies Record<
    Lang,
    {
        title: string;
        bullish: string;
        bearish: string;
        confidence: string;
        strongBuy: string;
        buy: string;
        strongSell: string;
        sell: string;
        neutral: string;
        trade: string;
        basedOnSignal: string;
        bullishExplanation: string;
        bearishExplanation: string;
        neutralExplanation: string;
        sentimentPulse: string;
        liveBias: string;
    }
>;

function getSignalText(t: (typeof text)[Lang], bull: number, bear: number) {
    if (bull > 65) {
        return {
            label: t.strongBuy,
            tone: "text-emerald-300",
            badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
            glow: "from-emerald-500/20 to-transparent",
        };
    }

    if (bull > 55) {
        return {
            label: t.buy,
            tone: "text-emerald-300",
            badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
            glow: "from-emerald-500/10 to-transparent",
        };
    }

    if (bear > 65) {
        return {
            label: t.strongSell,
            tone: "text-red-300",
            badge: "border-red-500/20 bg-red-500/10 text-red-300",
            glow: "from-red-500/20 to-transparent",
        };
    }

    if (bear > 55) {
        return {
            label: t.sell,
            tone: "text-red-300",
            badge: "border-red-500/20 bg-red-500/10 text-red-300",
            glow: "from-red-500/10 to-transparent",
        };
    }

    return {
        label: t.neutral,
        tone: "text-amber-300",
        badge: "border-amber-500/20 bg-amber-500/10 text-amber-300",
        glow: "from-amber-500/10 to-transparent",
    };
}

/* ================= COMPONENT ================= */
export default function MarketSentiment({
    pair,
    lang,
    sentiment,
}: Props) {
    const t = text[lang];
    const formattedPair = formatPair(pair);

    const initialBull = useMemo(
        () => sentiment?.bull ?? generateBaseSentiment(pair),
        [pair, sentiment]
    );
    const initialBear = useMemo(
        () => sentiment?.bear ?? 100 - initialBull,
        [initialBull, sentiment]
    );

    const [bull, setBull] = useState(initialBull);
    const [bear, setBear] = useState(initialBear);

    useEffect(() => {
        setBull(initialBull);
        setBear(initialBear);
    }, [initialBull, initialBear]);

    useEffect(() => {
        if (sentiment) return;

        const interval = setInterval(() => {
            setBull((prev) => {
                const change = Math.random() * 2 - 1;
                const next = clamp(prev + change, 30, 70);
                const rounded = Number(next.toFixed(1));

                setBear(Number((100 - rounded).toFixed(1)));
                return rounded;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [sentiment]);

    const signal = getSignalText(t, bull, bear);
    const confidence = Math.abs(bull - bear);

    function getExplanation() {
        if (bull > 55) {
            return `${formattedPair} ${t.bullishExplanation}`;
        }

        if (bear > 55) {
            return `${formattedPair} ${t.bearishExplanation}`;
        }

        return `${formattedPair} ${t.neutralExplanation}`;
    }

    return (
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#0B0F1A_0%,#090D16_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${signal.glow}`}
            />

            <div className="relative border-b border-white/10 px-5 py-5 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="mb-2 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300">
                            {t.sentimentPulse}
                        </div>

                        <h2 className="text-2xl font-semibold tracking-tight text-white">
                            {t.title}
                        </h2>
                    </div>

                    <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${signal.badge}`}
                    >
                        {signal.label}
                    </span>
                </div>
            </div>

            <div className="relative space-y-6 px-5 py-5 sm:px-6">
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                            {t.bullish}
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-emerald-400">
                            {bull.toFixed(1)}%
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                            {t.bearish}
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-red-400">
                            {bear.toFixed(1)}%
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
                        <span>{t.bullish}</span>
                        <span>{t.bearish}</span>
                    </div>

                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                            className="bg-emerald-500 transition-all duration-700"
                            style={{ width: `${bull}%` }}
                        />
                        <div
                            className="bg-red-500 transition-all duration-700"
                            style={{ width: `${bear}%` }}
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                                {t.liveBias}
                            </div>
                            <div className={`mt-1 text-sm font-semibold ${signal.tone}`}>
                                {signal.label}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                                {t.confidence}
                            </div>
                            <div className="mt-1 text-sm font-semibold text-white">
                                {confidence.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-sm leading-6 text-gray-400">{getExplanation()}</p>

                <Link
                    href="/go/exness"
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400"
                >
                    {t.trade} {formattedPair} {t.basedOnSignal} →
                </Link>
            </div>
        </section>
    );
}