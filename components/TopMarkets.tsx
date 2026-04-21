import Link from "next/link";
import type { Lang } from "@/lib/i18n";

type Props = {
    lang?: Lang;
};

type MarketTrend = "bullish" | "bearish";

type MarketItem = {
    pair: string;
    name: Record<Lang, string>;
    trend: MarketTrend;
    change: string;
    volume: string;
};

const markets: MarketItem[] = [
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

const text: Record<
    Lang,
    {
        title: string;
        subtitle: string;
        viewAll: string;
        bullish: string;
        bearish: string;
        vol: string;
        analysis: string;
        trade: string;
    }
> = {
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
        subtitle: "Entdecke die meistgehandelten Forex-Paare mit Einblicken",
        viewAll: "Alle anzeigen →",
        bullish: "Steigend",
        bearish: "Fallend",
        vol: "Vol",
        analysis: "Analyse anzeigen →",
        trade: "Handeln",
    },
    fr: {
        title: "Marchés populaires",
        subtitle: "Découvrez les paires forex les plus échangées",
        viewAll: "Voir tout →",
        bullish: "Haussier",
        bearish: "Baissier",
        vol: "Vol",
        analysis: "Voir analyse →",
        trade: "Trader",
    },
};

function formatPair(pair: string) {
    return `${pair.slice(0, 3)}/${pair.slice(3)}`;
}

export default function TopMarkets({ lang = "en" }: Props) {
    const t = text[lang];

    return (
        <section className="relative mx-auto max-w-7xl px-4 py-12">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-indigo-500/10 blur-2xl" />

            <div className="relative z-10">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{t.title}</h2>
                        <p className="mt-2 text-sm text-gray-400">{t.subtitle}</p>
                    </div>

                    <Link
                        href={`/${lang}/country/markets`}
                        className="shrink-0 text-sm text-blue-400 hover:text-blue-300"
                    >
                        {t.viewAll}
                    </Link>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {markets.map((m) => {
                        const isUp = m.trend === "bullish";

                        return (
                            <Link
                                key={m.pair}
                                href={`/${lang}/country/markets/${m.pair.toLowerCase()}`}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F1A] p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-500/50"
                            >
                                <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-r from-blue-500/10 to-indigo-500/10" />

                                <div className="relative z-10">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <h3 className="text-xl font-semibold">
                                            {formatPair(m.pair)}
                                        </h3>

                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${isUp
                                                    ? "bg-green-500/10 text-green-400"
                                                    : "bg-red-500/10 text-red-400"
                                                }`}
                                        >
                                            {isUp ? t.bullish : t.bearish}
                                        </span>
                                    </div>

                                    <p className="mb-5 text-sm text-gray-400">
                                        {m.name[lang]}
                                    </p>

                                    <div className="mb-5 flex items-center justify-between text-sm">
                                        <span
                                            className={`font-semibold ${isUp ? "text-green-400" : "text-red-400"
                                                }`}
                                        >
                                            {m.change}
                                        </span>

                                        <span className="text-gray-400">
                                            {t.vol}: {m.volume}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">{t.analysis}</span>

                                        <span className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">
                                            {t.trade}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}